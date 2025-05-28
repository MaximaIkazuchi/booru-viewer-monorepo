package utils

import (
	"fmt"
	"net/http"
	"strconv"
)

// CollectIntQuery parses and collect multiple integer query parameters from the request.
//
// It receives an http.Request and a map of query parameter keys with their default values.
//
// For each key in the map:
//   - If the query parameter exists and is a valid integer, it will be parsed and returned.
//   - If the query parameter is missing, the default value will be used.
//   - If the query parameter exists but is not a valid integer, it returns an error.
//
// Parameters:
//   - r: the incoming HTTP request
//   - key: a map where the key is the query parameter name and the value is the default integer to use if missing
//
// Returns:
//   - map[string]int: the parsed query parameters with their respective values
//   - error: error if any parameter fails to parse as an integer
func CollectIntQuery(r *http.Request, key map[string]int) (map[string]int, error) {
	result := make(map[string]int)
	for k, d := range key {
		if str := r.URL.Query().Get(k); str != "" {
			v, err := strconv.Atoi(str)
			if err != nil {
				return nil, fmt.Errorf("Invalid %s param", k)
			}
			result[k] = v
		} else {
			result[k] = d
		}
	}

	return result, nil
}

// CollectStringQuery collect multiple string query parameters from the request.
//
// It receives an http.Request and a map of query parameter keys with their default values.
//
// For each key in the map:
//   - If the query parameter is missing, the default value will be used.
//
// Parameters:
//   - r: the incoming HTTP request
//   - key: a map where the key is the query parameter name and the value is the default integer to use if missing
//
// Returns:
//   - map[string]int: the parsed query parameters with their respective values
//   - error: error if any parameter fails to parse as an integer
func CollectStringQuery(r *http.Request, key map[string]string) map[string]string {
	result := make(map[string]string)
	for k, d := range key {
		if str := r.URL.Query().Get(k); str != "" {
			result[k] = str
		} else {
			result[k] = d
		}
	}

	return result
}