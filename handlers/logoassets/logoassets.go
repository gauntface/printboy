package logoassets

import (
	"fmt"
	"net/http"

	"github.com/gauntface/miniworks-label-print-server/runtime/installassets"
)

func BuildHandler() http.Handler {
	l, err := installassets.LogosDir()
	if err != nil {
		panic(fmt.Errorf("unable to get logo directory: %v", err))
	}
	fs := http.FileServer(http.Dir(l))
	return http.StripPrefix(installassets.LogoAssetsRoute, fs)
}
