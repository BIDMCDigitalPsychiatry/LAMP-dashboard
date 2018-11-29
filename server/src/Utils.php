<?php

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
        } else if (count($list) > 0) {

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
