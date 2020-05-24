package print

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os/exec"
	"strings"
)

func BuildHandler() http.Handler {
	return &handler{}
}

type handler struct{}

func (h handler) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("%q requests not supported", req.Method)))
		return
	}

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("Unable to read request body: %v", err)))
		return
	}

	var p payload
	err = json.Unmarshal(body, &p)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("Unable to parse request body: %v", err)))
		return
	}

	filepath, err := writeFile(p.Base64EncodedImage)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("Unable to write img to tmp file: %v", err)))
		return
	}
	// defer os.Remove(filepath)

	args := []string{
		// "-o PageSize=30252_Address",
		// "-o PrintQuality=Graphics",
		// "-o PrintDensity=Light",
		"-d dymo_lw450t",
		filepath,
	}

	cmd := exec.Command("lp", strings.Join(args, " "))
	o, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("command: lp %v\n\ncommand output: %v\n\ncommand error: %v\n", strings.Join(args, " "), string(o), err)
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("Unable to run print job.\nError: %v.\n\nOutput: %v", err, string(o))))
		return
	}

	v, err := json.Marshal(response{
		Success: true,
	})
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte(fmt.Sprintf("Unable to marshal json response: %v", err)))
		return
	}
	res.Write(v)
}

func writeFile(b64 string) (string, error) {
	b64 = strings.TrimPrefix(b64, "data:image/png;base64,")
	dec, err := base64.StdEncoding.DecodeString(b64)
	if err != nil {
		return "", err
	}

	f, err := ioutil.TempFile("", "mw-label.*.png")
	if err != nil {
		return "", err
	}
	defer f.Close()

	if _, err := f.Write(dec); err != nil {
		return "", err
	}
	if err := f.Sync(); err != nil {
		return "", err
	}
	return f.Name(), nil
}

type payload struct {
	Base64EncodedImage string
}

type response struct {
	Success bool
}
