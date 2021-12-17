package main

import (
    "fmt" 
    "log"
	"encoding/json"
    "net/http"
    "io/ioutil"
    "github.com/gorilla/mux"
    ipfs "github.com/ipfs/go-ipfs-api"
	"strings"
)

const ipfsNode = "https://ipfs.infura.io:5001"
const ipfsGateway = "https://gateway.ipfs.io/ipfs/"

func getGuide(hash string) (string, error) {
    url := ipfsGateway + hash;
    fmt.Println(url)
    resp, err := http.Get(url)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()
    data, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return "", err
    }

    return string(data), nil
}

func createGuide(raw string) (string, error) {
	//TODO VERIFY: good json, no xss, etc

	shell := ipfs.NewShell(ipfsNode)
	hash, err := shell.Add(strings.NewReader(raw))
	if err != nil {
		return "", err
	}
	fmt.Println("Raw: " + raw)
	fmt.Println("\nHash: " + hash)
	return hash, nil
}

func createHandle(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)			
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	guide := vars["hash"] //whhy?

	fmt.Println("create handle reached: " + guide)
	hash, err := createGuide(guide);
	if err != nil {
		log.Fatal(err) //TODO return err to response
	}
	data, _ := json.Marshal("{\"hash\": \"" + hash + "\"}")
	w.Write(data)
//	fmt.Fprintf(w, data);
}

func guideHandle(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    w.WriteHeader(http.StatusOK)
    w.Header().Set("Content-Type", "application/json")
    guide, err := getGuide(vars["hash"])
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Guide: %s\n", guide)
    w.Write([]byte(guide))

}

func main() {
    //sh := ipfs.NewShell(ipfsNode)

    router := mux.NewRouter();
    router.HandleFunc("/api/create/{hash}", createHandle)
    router.HandleFunc("/guides/{hash}", guideHandle).Methods("GET")
    router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))
    http.Handle("/", router)

    log.Println("FStudy server started at localhost:8000")    
    if err := http.ListenAndServe(":8000", nil); err != nil {
        log.Fatal(err)
    }
 
}
