package staticfiles

import "net/http"

func BuildHandler(assetsDir string) http.Handler {
	fs := http.FileServer(http.Dir(assetsDir))
	return http.StripPrefix("/static/", fs)
}
