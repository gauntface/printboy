package uploadlogo

import (
	"fmt"
	"net/http"

	"github.com/gauntface/miniworks-label-print-server/handlers/utils/errorresp"
	"github.com/gauntface/miniworks-label-print-server/runtime/installassets"
)

func BuildHandler() http.Handler {
	return &handler{}
}

type handler struct{}

func (h handler) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		errorresp.BadRequestString(res, fmt.Sprintf("%q requests not supported", req.Method))
		return
	}

	// FormFile returns the first file for the given key `myFile`
	// it also returns the FileHeader so we can get the Filename,
	// the Header and the size of the file
	file, handler, err := req.FormFile("logo-upload")
	if err != nil {
		errorresp.BadRequestString(res, fmt.Sprintf("Unable to access file from form: %v", err))
		return
	}
	defer file.Close()

	installassets.SaveLogo(handler.Filename, file)

	rp := req.FormValue("redirect-path")

	http.Redirect(res, req, rp, 302)
}

type response struct {
	Success bool
}
