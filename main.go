package main

import (
    "log"
    "net/http"
    "github.com/gorilla/mux"
    ipfs "github.com/ipfs/go-ipfs-api"
)

func createHandle(w http.ResponseWriter, r *http.Request) {

}

func guideHandle(w http.ResponseWriter, r *http.Request) {

}

func main() {
    sh := ipfs.NewShell("https://ipfs.infura.io:5001")

    router := mux.NewRouter();
    router.HandleFunc("/create", createHandle)
    router.HandleFunc("/guides/{hash}", guideHandle)
    router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/build")))
    http.Handle("/", router)

    log.Println("FStudy server started at localhost:8000")    
    if err := http.ListenAndServe(":8000", nil); err != nil {
        log.Fatal(err)
    }
}
