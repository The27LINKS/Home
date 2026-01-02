document.addEventListener("DOMContentLoaded", function() {
    // Load Header
    fetch("components/header.html")
        .then(response => {
            if (!response.ok) throw new Error("Header not found");
            return response.text();
        })
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading header:", error));

    // Load Footer
    fetch("components/footer.html")
        .then(response => {
            if (!response.ok) throw new Error("Footer not found");
            return response.text();
        })
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));
});
