console.log(cinput.value);
async function find() {
    var MY_KEY = config.MY_KEY;
    var GUID = config.GUID;
    var linkInput = document.getElementById("cinput");
    var linkError = document.getElementById("link-error");

    var pattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (pattern.test(linkInput.value)) {
        // Link is valid, do something
        linkError.style.display = "none";
        await fetch("https://api-ssl.bitly.com/v4/shorten", {
            method: "POST",
            mode: "cors",
            headers: {
                Authorization: `Bearer ${MY_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                long_url: cinput.value,
                domain: "bit.ly",
                group_guid: GUID,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                const new_link = data.link.replace("https://", "");
                fetch(
                    `https://api-ssl.bitly.com/v4/bitlinks/${new_link}/qr?image_format=png`,
                    {
                        mode: "cors",
                        headers: {
                            Authorization: `Bearer ${MY_KEY}`,
                        },
                    }
                )
                    .then((response) => response.json())
                    .then((output) => {
                        displaydata(output);
                    });
            });
        cinput.value = "";
    } else {
        // Link is not valid, show error message
        linkError.style.display = "block";
        setTimeout(() => {
            window.location.reload()
        }, 3000)
    }
}

function displaydata(output) {
    console.log(output);
    let html_data = `
          <img width="200px" height="200px" src=${output.qr_code} alt="Qr code" class="qr_img"/>
          <div>
            <h3 class="text-light">Here's your short link...</h3>
          </div>
            <div class="d-flex justify-content-center mb-3">
  <div class="p-2"><p class="text-light" id="copy-input">${output.link}</p></div>
  <div class="p-2"><button class="btn btn-outline-light btn-sm" onclick="copy()" id="copy-btn" type="button">Copy</button></div>
</div>
            `
    result.innerHTML = html_data
}

function copy() {
    var copyText = document.getElementById("copy-input");
    var textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Text copied to clipboard!");
}
