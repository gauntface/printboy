package index

import (
	"fmt"
	"html/template"
	"net/http"
	"path/filepath"

	"github.com/gauntface/miniworks-label-print-server/handlers/utils/errorresp"
)

func BuildHandler(assetsDir string) http.Handler {
	return &handler{
		assetsDir: assetsDir,
	}
}

type handler struct {
	assetsDir string
}

func (h handler) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	data := PageData{}
	tmpl, err := template.ParseFiles(
		filepath.Join(h.assetsDir, "templates", "index.html"),
		filepath.Join(h.assetsDir, "templates", "components", "c-header.html"),
		filepath.Join(h.assetsDir, "templates", "components", "c-footer.html"),
	)
	if err != nil {
		fmt.Printf("Unable to parse template: %v\n", err)
		errorresp.BadRequestString(res, fmt.Sprintf("Unable to parse template: %v", err))
		return
	}

	err = tmpl.Execute(res, data)
	if err != nil {
		fmt.Printf("Unable to render template: %v\n", err)
		errorresp.BadRequestString(res, fmt.Sprintf("Unable to render template: %v", err))
		return
	}
}

type PageData struct {
}
