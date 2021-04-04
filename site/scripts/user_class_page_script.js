var userGuid = "ffffffffffffffffffffffffffffffff";
const soapUrl = `${window.location.protocol}//${window.location.host}/wmexam/wmstudyservice.WSDL`;

function getSoapRequestBody(action, params) {
    var res = `<v:Envelope xmlns:v="http://schemas.xmlsoap.org/soap/envelope/" xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/">
    <v:Header/>
    <v:Body>
        <${action} xmlns="http://webservice.myi.cn/wmstudyservice/wsdl/" id="o0" c:root="1">`;
    for (let key in params) {
        res += `
            <${key} i:type="d:${typeof params[key]}">${params[key]}</${key}>`
    }
    res += `
        </${action}>
    </v:Body></v:Envelope>`;
    return res;
}

function getSoapRequest(soapUrl, action, params, onload) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", soapUrl);
    xhr.withCredentials = true;
    xhr.setRequestHeader('User-Agent', 'ksoap2-android/2.6.0+');
    xhr.setRequestHeader('SOAPAction', `http://webservice.myi.cn/wmstudyservice/wsdl/${action}`);
    xhr.setRequestHeader('Content-Type', 'text/xml;charset=utf-8');
    xhr.setRequestHeader('Cookie', `userguid=${userGuid};username=paduser;usergroupguid=ffffffffffffffffffffffffffffffff`);
    xhr.setRequestHeader('Accept-Encoding', 'gzip')
    xhr.responseType = "document";
    xhr.addEventListener("load", onload)
    xhr.send(getSoapRequestBody(action, params));
    return xhr;
}

function login() {
    console.log(soapUrl)
    userId = document.getElementById("user-id").value;
    let xhr = getSoapRequest(soapUrl, "UsersGetUserGUID", {"lpszUserName": userId}, () => {
        userGuid = xhr.responseXML.getElementsByTagName("AS:szUserGUID")[0].innerHTML;
        alert("登录成功 " + userGuid);
    });
}

function changeAll(b) {
    var items = document.getElementsByName("category");
    for (let i of items) {
        i.checked = b
    }
    onSubjectCheckboxChange();
}

function onSubjectCheckboxChange() {
    var items = document.getElementsByName("category");
    var state = [];
    for (let i of items) {
        state[i.value] = i.checked;
    }

    var lsitems = document.getElementsByClassName("lesson-schedule")
    for (let i of lsitems) {
        if (state[i.dataset.subject]) {
            i.style.display = ''
        } else {
            i.style.display = 'none'
        }
    }
}