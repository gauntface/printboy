package generatelabel

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

	cs, err := installassets.Contents()
	if err != nil {
		errorresp.BadRequestString(res, fmt.Sprintf("Unable to get contents: %v", err))
		return
	}

	data := PageData{
		Title:    "Generate label",
		Logos:    l,
		Contents: cs,
	}
	tmpl, err := template.ParseFiles(
		filepath.Join(h.assetsDir, "templates", "generate-label.html"),
		filepath.Join(h.assetsDir, "templates", "components", "c-header.html"),
		filepath.Join(h.assetsDir, "templates", "components", "c-footer.html"),
	)
	if err != nil {
		errorresp.BadRequestString(res, fmt.Sprintf("Unable to render template: %v", err))
		return
	}
	tmpl.Execute(res, data)
}

type PageData struct {
	Title    string
	Logos    []installassets.Logo
	Contents []installassets.Content
}
