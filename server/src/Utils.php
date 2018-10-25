<?php

//
// Log
//

class log {
    protected function __construct() {}
    protected function __clone() {}

    // Shortcut to write a string to a log file if it exists.
    // Remember! `chmod 662` for {'sys.log', 'err.log', 'transact.log'}!
    private static function write_log($file, $str) {
        error_log($str);

        // TODO: PRODUCTION CODE:
        //if (file_exists($file)) file_put_contents($file, '[' . date("Y-m-d h:i:sa") . '] ' . $str . '\n', FILE_APPEND);
    }

    // The internal sys_log() function is for any non-database logs to be recorded
    // along with a timestamp of when it occurred. Should be used sparingly.
    public static function sys($log) {
        if (!is_string($log)) $log = json_encode($log, JSON_PRETTY_PRINT);
        log::write_log('./sys.log', $log);
    }

    // The internal err_log() function is for any database errors to be recorded
    // along with a timestamp of when it occurred. It should return a UUID of the
    // error, which will then be sent to the administrator and the user as a ticket.
    //
    // Note: if you pass a PDOException, it will automatically log the message and SQL.
    public static function err($log) {
        if ($log instanceof Exception)
            $log = "{$log->getMessage()}\n{$log->getTraceAsString()}";
        $uuid = uniqid('err_');
        log::write_log('./err.log', "[$uuid] $log");
        return [$uuid => is_string($log) ? explode("\n", $log) : $log];
    }

    // The internal transact_log() function is for any database transactions to be recorded
    // along with a timestamp of when it occurred.
    public static function transact($log) {
        if (!is_string($log)) $log = json_encode($log, JSON_PRETTY_PRINT);
        log::write_log('./transact.log', $log);
    }
}

//
// Dynamics
//

class Dynamics {
    protected function __construct() {}
    protected function __clone() {}

    // Dynamically invokes a method and maps the associative array of arguments
    // onto the method's parameter names. If any non-optional arguments are
    // missing, the $missing callback is invoked with the parameter name.
    // If the $arguments array contains more arguments than method parameters exist,
    // these leftover arguments will be automatically discarded.
    //
    // Usage:
    // $p = ["username" => "abc", "nonexistentparam" => 2];
    // Dynamics::invoke("User::add", $p, function($name) {
    //     die('Missing or invalid parameter $name!');
    // }
    //
    public static function invoke($method, $arguments, callable $missing) {
        $values = [];
        $all = (new \ReflectionMethod($method))->getParameters();
        foreach ($all as $p) {
            $name = $p->getName();
            $exists = array_key_exists($name, $arguments);
            if (!$exists && !$p->isDefaultValueAvailable()) {
                $missing($name);
                $arguments[$name] = null;
            }
            $values[$p->getPosition()] = $exists ? $arguments[$name] : $p->getDefaultValue();
        }
        return $method(...$values);
    }

    // Unpacks a function's arguments from their positions into an associative
    // array; the inverse of dynamically invoking a function. This MUST be used
    // with the current method name and arguments passed in. If it is not used
    // in this exact way, or a method's argument does not exist, it will fail.
    //
    // Usage: $args = Dynamics::extract(__METHOD__, func_get_args());
    //
    // TODO: Make `__METHOD__, func_get_args()` go away.
    public static function extract($method, $arguments) {
        $values = [];
        $all = (new \ReflectionMethod($method))->getParameters();
        foreach ($all as $p) {
            $values[$p->getName()] = $arguments[$p->getPosition()];
        }
        return $values;
    }

    // Return all sub-`ReflectionClass` of the given class.
    public static function children($of) {
        $result = [];
        foreach (get_declared_classes() as $class) if (is_subclass_of($class, $of)) {
            $result[] = new ReflectionClass($class);
        }
        return $result;
    }

    // Flattens an input object into a single JSON-compatible object.
    // If idx1 is true, integer array indices are incremented by 1 (to human readable digits).
    public static function flatten($input, $idx1 = false, $prefix = '.', $_root = '', $_result = []) {
        
        // Bail early if we're not an array or object.
        if(!(is_array($input) || is_object($input)))
            return $input;

        // Iterate over the array, or object mapped as an array.
        foreach((is_object($input) ? (array)$input : $input) as $k => $v) {

            // If the object has a preferred JSON conversion, use that.
            if(is_object($v) && $v instanceof JsonSerializable)
                $v = $v->jsonSerialize();

            // If the value to insert is yet another array/object, recurse into it.
            if(is_array($v) || is_object($v)) {
                $x = ($idx1 === true && is_int($k) ? $k + 1 : $k);
                $_result = Dynamics::flatten($v, $idx1, $prefix, $_root . $x . $prefix, $_result);
                array_drop($input, $x);
            } else $_result[$_root . $k] = $v;
        }
        return $_result;
    }

    // Groups a set of objects by their properties such that the resultant dict 
    // holds a map of `field_name => [obj1, null, obj3, ...]` for the union of all fields.
    public static function multigroup($input) {

        // Prime output with all fields so missing ones can be filled in with null.
        $output = [];
        foreach($input as $obj) foreach(array_keys($obj) as $key) {
            $output[$key] = []; // FIXME: causes out-of-order rows where missing in some objs 
        }

        // Iterate all list items and merge into output by key.
        foreach($input as $item) {
            $item = (array)$item;

            // For any missing field previously primed, fill it in with null.
            foreach(array_keys($output) as $key)
                $output[$key][] = isset($item[$key]) ? $item[$key] : null;
        }
        return $output;
    }

    // Mirror of `json_encode`, encodes an array to a CSV string which is returned.
    // If transpose is true, the fields become the first item of each row.
    public static function csv_encode($list, $transpose = false) {
        $stream = fopen('php://memory', 'r+');
        if ($transpose === true) {
            foreach ($list as $key => $value)
                fputcsv($stream, array_merge([$key], (array)$value));
        } else {

            // Since un-transposed is actually illogical from PHP's perspective,
            // put the keys row first, and then transpose the values of the list.
            //
            // array_map with a null callback can be used to construct an array of 
            // arrays, which we abuse by unpacking our list values arrays into it.
            fputcsv($stream, array_keys($list));
            foreach (array_map(null, ...array_values($list)) as $value)
                fputcsv($stream, (array)$value);
        }

        // Rewind the buffer and return the string; can be written to disk later.
        rewind($stream);
        $csv = stream_get_contents($stream);
        fclose($stream);
        return $csv;
    }
}

//
// ScriptRunner
//

interface ScriptRunner {
    public static function execute($script, $input, $packages = []);
}

// RScript @ Ubuntu 18.04 LTS + R 3.5.1
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

//
// Miscellaneous Functions
//

// Equivalent to (safely) `rm -rf <path>` within PHP.
function sys_rm_rf($path) {
    foreach (glob($path . '/*') as $file)
        is_dir($file) ? sys_rm_rf($file) : unlink($file);
    rmdir($path);
}

// Stub getallheaders() for NGINX.
if (!function_exists('getallheaders')) {
    function getallheaders() {
        if (!is_array($_SERVER))
            return [];
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_')
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
        }
        return $headers;
    }
}

// Remove and return a value by the given key in the object or array.
function array_drop(&$arr, $key) {
    if (is_object($arr)) {
        if (!isset($arr->{$key}))
            return null;
        $value = $arr->{$key};
        unset($arr->{$key});
        return $value;
    } else {
        if (!isset($arr[$key]))
            return null;
        $value = $arr[$key];
        unset($arr[$key]);
        return $value;
    }
}

// Get the inner string of a doc-comment from a Reflection class.
function get_comment($item, $default = null, $doc_prefix = '') {
    $matches = [];
    preg_match("/\/\*\*{$doc_prefix}([\*\s\S]+)\*\//", ($item)->getDocComment(), $matches);
    if (count($matches) == 2)
        return trim($doc_prefix . str_replace("\n * ", ' ', $matches[1]));
    else return $default;
}
