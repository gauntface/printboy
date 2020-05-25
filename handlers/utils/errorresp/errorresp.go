package errorresp

import (
	"net/http"
)

func BadRequestString(res http.ResponseWriter, msg string) {
	res.WriteHeader(http.StatusBadRequest)
	res.Write([]byte(msg))
}
