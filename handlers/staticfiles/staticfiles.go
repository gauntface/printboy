package staticfiles

import "net/http"

func BuildHandler(assetsDir string) http.Handler {
	return http.FileServer(http.Dir(assetsDir))
}
