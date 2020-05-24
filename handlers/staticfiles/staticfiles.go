package staticfiles

import "net/http"

func BuildHandler() http.Handler {
	return http.FileServer(http.Dir("./static"))
}
