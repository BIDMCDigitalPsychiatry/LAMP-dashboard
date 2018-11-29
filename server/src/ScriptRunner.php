<?php

interface ScriptRunner {

	/**
	 *
	 */
	public static function execute($script, $input, $packages = []);
}

/**
 * RScript @ Ubuntu 18.04 LTS + R 3.5.1
 */
class RScriptRunner implements ScriptRunner {

	//
	// Maintenance:
	//
	// KILLALL: docker kill $(docker ps -q); docker rm $(docker ps -a -q)
	// CLEANUP: docker rmi $(docker images -q)
	// EXEC: docker run --rm -it r-lamp:latest
	//
	// TODO: docker commit -> squash -> load?
	//

	// Preinstalled libraries as part of the Docker image located at `/usr/lib/R/library`.
	private static $preinstalled = [
		"base", "boot", "class", "cluster", "codetools", "compiler", "datasets",
		"docopt", "foreign", "graphics", "grDevices", "grid", "jsonlite", "KernSmooth",
		"lattice", "littler", "MASS", "Matrix", "methods", "mgcv", "nlme", "nnet",
		"parallel", "Rcpp", "rpart", "spatial", "splines", "stats", "stats4",
		"survival", "tcltk", "tools", "translations", "utils"
	];

	// The subscript driver script. // TODO: ~0.65s time
	private static $driverScript = "
        library(jsonlite)
        options(error=function() traceback(2))

        # Execute the script with wrapped I/O + logging.
        LAMP_input <<- fromJSON(file('/src/input'))
        commandArgs <- function(...) LAMP_input
        source('/src/script.r', print.eval=TRUE)
        LAMP_output <<- get('value', .Last.value)

        # If the result was a plot, save and read the file as a blob.
        if ('ggplot' %in% class(LAMP_output)) {
            get <- function(x, z) if(x %in% names(LAMP_input$`_plot`)) LAMP_input$`_plot`[[x]] else z

            # Perform pixel <-> DPI translation based on img device and scale.
            type <- get('type', 'png')
            dpi <- 100 * get('scale', 1)
            width <- get('width', 800) / dpi
            height <- get('height', 600) / dpi

            ggsave('tmp.out', device=type, dpi=dpi, width=width, height=height)
            LAMP_output <<- readBin('tmp.out', 'raw', file.info('tmp.out')\$size)
        }

        # Serialize output to JSON or reinterpret if possible.
        write(tryCatch({
            toJSON(LAMP_output, auto_unbox=TRUE)
        }, error = function(err) {
            return(serializeJSON(LAMP_output))
        }), '/src/stdout')
    ";

	// Stuff... Adds ~1s to each script execution.
	public static function execute($script, $input, $packages = []) {
		if (!(is_string($script) && is_array($packages))) return null;
		$start = microtime(true);
		$logs = '';

		// Initializing environment.
		$container_name = uniqid('scratch_');
		$scratch_name = '/src/' . $container_name;
		mkdir($scratch_name, 0755, true);
		file_put_contents($scratch_name.'/main.r', RScriptRunner::$driverScript);
		file_put_contents($scratch_name.'/script.r', $script);
		file_put_contents($scratch_name.'/input', json_encode($input));

		// Build a new image with an inline Dockerfile unless one already exists.
		if (shell_exec('docker images -q r-lamp:latest 2> /dev/null') == "") {
			$logs .= shell_exec("
				docker build -t r-lamp - 2>&1 <<- EOF
				FROM rocker/r-apt:bionic

				## Install some useful prerequisites for most R packages.
				RUN apt-get update -qq && \
					apt-get install -y r-cran-jsonlite libxml2-dev libcairo2-dev libssl-dev libcurl4-openssl-dev && \
					apt-get update -qq 

				## Move default packages to share apt between containers, relink the installer.
				RUN mv /usr/local/lib/R/site-library/* /usr/lib/R/library/ && \
					mv /usr/lib/R/site-library/* /usr/lib/R/library/ && \
					rm -f /usr/local/bin/install2.r && \
					ln -s /usr/lib/R/library/littler/examples/install2.r /usr/local/bin/install2.r
				EOF
			");
		}

		// Assemble list of all non-installed packages to ATTEMPT binary installation.
		$packages = array_diff($packages,
			RScriptRunner::$preinstalled,
			array_map('basename', array_filter(glob('/src/apt-packages/*'), 'is_dir')),
			array_map('basename', array_filter(glob('/src/lib-packages/*'), 'is_dir'))
		);
		$netstr = count($packages) == 0 ? '--network none' : '';

		// Spin up a new Docker container. // TODO: ~0.4s time
		$logs .= shell_exec("
            docker run --rm -dt \
                --name $container_name \
                $netstr \
                --memory=2g \
                -v $scratch_name:/src \
                -v /src/lib-packages:/usr/local/lib/R/site-library \
                -v /src/apt-packages:/usr/lib/R/site-library \
                r-lamp:latest bash 2>&1
        ");

		// First configure the R environment and packages with network available. (With 1m timeout.)
		// Disconnect the running container from the network!
		// If there were no packages to install, the container is already disconnected.
		if (count($packages) > 0) {
			$apt_pkgs = array_map(function($x) {
				return 'r-cran-'.strtolower(trim($x));
			}, $packages);
			$pkg_setup = 'apt-get update -qq && apt-get install -y '.implode(' ', $apt_pkgs).
				'; install2.r -s ' . implode(' ', $packages);
			$logs .= shell_exec("docker exec $container_name bash -c \"$pkg_setup\" 2>&1");
			$logs .= shell_exec("docker network disconnect bridge $container_name 2>&1");
		}

		// Execute the MAIN script in Docker with 30s timeout. // TODO: ~0.3s time
		$logs .= shell_exec("docker exec $container_name timeout 30s \
            bash -c \"time Rscript /src/main.r\" 2>&1
        ");

		// Spin down the Docker container. // TODO: ~0.3s time
		$logs .= shell_exec("docker rm --force $container_name 2>&1");

		// Perform Scratch cleanup after backing up the environment.
		$output = file_exists($scratch_name.'/stdout') ?
			json_decode(file_get_contents($scratch_name.'/stdout')) : '';
		sys_rm_rf($scratch_name);
		$logs .= 'benchmark: ' . (microtime(true) - $start);
		return [ "output" => $output, "log" => $logs];
	}
}

// Equivalent to (safely) `rm -rf <path>` within PHP.
function sys_rm_rf($path) {
	foreach (glob($path . '/*') as $file)
		is_dir($file) ? sys_rm_rf($file) : unlink($file);
	rmdir($path);
}
