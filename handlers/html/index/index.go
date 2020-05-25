package index

import (
	"fmt"
	"html/template"
	"net/http"
	"path/filepath"

	"github.com/gauntface/miniworks-label-print-server/handlers/utils/errorresp"
	"github.com/gauntface/miniworks-label-print-server/runtime/installassets"
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
	l, err := installassets.Logos()
	if err != nil {
		errorresp.BadRequestString(res, fmt.Sprintf("Unable to get logos: %v", err))
		return
	}

	data := PageData{
		Logos: l,
	}
	tmpl := template.Must(template.ParseFiles(filepath.Join(h.assetsDir, "templates", "index.html")))
	tmpl.Execute(res, data)
}

type PageData struct {
	Logos []installassets.Logo
}
