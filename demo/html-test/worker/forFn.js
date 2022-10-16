function forFunction(arr) {
    let frag = ''
    for (let i = 0; i < arr; i++) {
        frag += `<p>${i}</p>`
    }
    return frag
}