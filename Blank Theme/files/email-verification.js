'use strict';

function getParameterByName(name, url) {
    if (url === void 0) { url = window.location.href; }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function makeAjaxRequestWithRetriesAndJitter(url, method, data, successCallback, errorCallback) {
    var MAX_RETRIES = 4;
    var makeRequest = function (retriesLeft) {
        $.ajax({
            url: url,
            method: method,
            data: data,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
            success: function (response) {
                successCallback(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (retriesLeft > 0) {
                    var delay = calculateDelay(retriesLeft, MAX_RETRIES);
                    setTimeout(function () {
                        makeRequest(retriesLeft - 1);
                    }, delay);
                }
                else {
                    errorCallback(new Error(errorThrown));
                }
            },
        });
    };
    makeRequest(MAX_RETRIES);
}
function calculateDelay(retriesLeft, retriesInTotal) {
    var JITTER_RANGE_IN_MILI_SECS = 2000;
    var BASE_TIMEOUT_IN_MILI_SECS = 250;
    var jitter = Math.random() * JITTER_RANGE_IN_MILI_SECS;
    var timeoutInMiliSeconds = Math.pow(2, retriesInTotal - retriesLeft + 1) * BASE_TIMEOUT_IN_MILI_SECS;
    return jitter + timeoutInMiliSeconds;
}
function getCulturalStrings(queueCulture) {
    switch (queueCulture) {
        case "da-DK": {
            return {
                emailPlaceholder: "Indtast din e-mail",
                codePlaceholder: "Indtast din kode",
                verifyingMessage: "Verificerer. Vent venligst",
                submitText: "Indsend",
                signUpText: "Tilmeld",
            };
        }
        case "nb-NO": {
            return {
                emailPlaceholder: "Inntast din e-post",
                codePlaceholder: "sett inn koden din",
                verifyingMessage: "Bekrefter. Vennligst vent",
                submitText: "Send",
                signUpText: "Tilmeld",
            };
        }
        case "de-DE": {
            return {
                emailPlaceholder: "Bitte geben Sie Ihre E-Mail-Adresse ein",
                codePlaceholder: "Bitte geben Sie den Code ein",
                verifyingMessage: "Verifizierung. Bitte warten Sie",
                submitText: "Einsenden",
                signUpText: "Anmeldung",
            };
        }
        case "es-ES": {
            return {
                emailPlaceholder: "Introduce tu correo electrónico",
                codePlaceholder: "Por favor introduce el código",
                verifyingMessage: "Verificando. Por favor, espera",
                submitText: "Enviar",
                signUpText: "inscribirse",
            };
        }
        case "es-MX": {
            return {
                emailPlaceholder: "Por favor, introduzca su dirección de correo electrónico",
                codePlaceholder: "Por favor, introduzca el código",
                verifyingMessage: "Estamos verificando. Por favor, espere",
                submitText: "Enviar",
                signUpText: "inscribirse",
            };
        }
        case "fr-FR": {
            return {
                emailPlaceholder: "Veuillez entrer l'e-mail",
                codePlaceholder: "Veuillez entrer le code",
                verifyingMessage: "En cours de vérification. Veuillez patienter",
                submitText: "Envoyez",
                signUpText: "sinscrire",
            };
        }
        case "it-IT": {
            return {
                emailPlaceholder: "Inserisci e-mail",
                codePlaceholder: "Inserisci il codice",
                verifyingMessage: "Verifica in corso. Attendi",
                submitText: "Invia",
                signUpText: "iscrizione",
            };
        }
        case "nl-NL": {
            return {
                emailPlaceholder: "Voer e-mailadres in",
                codePlaceholder: "Voer code in",
                verifyingMessage: "Bezig met verifiëren. Even geduld alstublieft",
                submitText: "Verzenden",
                signUpText: "aanmelden",
            };
        }
        case "pt-PT": {
            return {
                emailPlaceholder: "Por favor, introduza o email",
                codePlaceholder: "Por favor, introduza o código",
                verifyingMessage: "Em verificação. Por favor, aguarde",
                submitText: "Submeter",
                signUpText: "inscrever-se",
            };
        }
        case "ja-JP": {
            return {
                emailPlaceholder: "メールアドレスを入力してください。",
                codePlaceholder: "コードを入力してください。",
                verifyingMessage: "確認中です。 しばらくお待ちください",
                submitText: "送信",
                signUpText: "サインアップ",
            };
        }
        default: {
            return {
                emailPlaceholder: "Please enter email",
                codePlaceholder: "Please enter code",
                verifyingMessage: "Verifying Please wait",
                submitText: "Submit",
                signUpText: "Sign up",
            };
        }
    }
}

function setChallengeStyles(css) {
    var head = document.head || document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    head.appendChild(style);
    style.appendChild(document.createTextNode(css));
}
function getStyles(boxColor, primaryTextColor, primaryColor) {
    return ("#main_invite_div {background-color:" +
        boxColor +
        "; color:" +
        primaryTextColor +
        ";padding: 10px;border-radius: 5px; display:flex; flex-wrap:wrap}" +
        ".input_box {display:flex;}" +
        "#invitee_email,#invitee_code, #invitee_customcode {height:35px; box-sizing:border-box;}" +
        ".message_box {margin-top:10px; text-align:left}" +
        ".hidden {display:none}" +
        "#btnSubmit_Email,#btnSubmit_Code {height: 35px;padding: 5px 16px; margin: 0 2px; min-width: 80px;}" +
        "#error_box,#error_box_code {color:red}" +
        "#loading_div,#loading_div_code {display:none}" +
        "#lblCode,#lblEmail {visibility:hidden}" +
        "#code_message {color: " +
        primaryColor +
        ";font-size: 16px;font-weight: bold;padding: 10px 0;text-align: left;}");
}

function getCodeScreen(codeInfo, codePlaceholder, submitText, verifyingMessage) {
    return ('<form onsubmit="verifyCode(event)"><div id="main_invite_div">' +
        '<label for="invitee_code" id="lblCode">' +
        codePlaceholder +
        "</label>" +
        '<div class="input_box"><input required placeholder="' +
        codePlaceholder +
        '" type="text" id="invitee_code" area-label="code" autofocus>' +
        '<button class="btn" type="submit" id="btnSubmit_Code">' +
        submitText +
        "</button></div>" +
        '<div id="code_message">' +
        codeInfo +
        "</div>" +
        '<div aria-live="assertive" class="message_box">' +
        '<div id="error_box_code"></div>' +
        '<div id="loading_div_code">' +
        verifyingMessage +
        "...........<br>" +
        "</div>" +
        "</div></form>");
}

function getCustomCodeScreen(codePlaceholder, submitText, verifyingMessage) {
    return ('<form onsubmit="verifyCustomCode(event)"><div id="main_invite_div">' +
        '<label for="invitee_customcode" id="lblEmail">' +
        codePlaceholder +
        "</label>" +
        '<div class="input_box"><input required area-label="email" placeholder="' +
        codePlaceholder +
        '" type= "text" id="invitee_customcode" autofocus autocomplete>' +
        '<button class="btn" type="submit" id="btnSubmit_Email">' +
        submitText +
        "</button></div>" +
        '<div aria-live="assertive" class="message_box">' +
        '<div id="error_box"></div>' +
        '<div id="loading_div">' +
        verifyingMessage +
        "...........<br>" +
        "</div>" +
        "</div></form>");
}

function getEmailScreen(isCustomCode, isSignupCase, codePlaceholder, emailPlaceholder, signUpText, submitText, verifyingMessage) {
    return ('<form onsubmit="' +
        (isCustomCode ? "verifyCustomCode(event)" : "verifyEmailGetCode(event)") +
        '"><div id="main_invite_div">' +
        '<label for="invitee_email" id="lblEmail">' +
        (isCustomCode ? codePlaceholder : emailPlaceholder) +
        "</label>" +
        '<div class="input_box"><input area-label="email" placeholder="' +
        (isCustomCode ? codePlaceholder : emailPlaceholder) +
        '" type="text" id="invitee_email" required autofocus autocomplete>' +
        '<button class="btn" type="submit" id="btnSubmit_Email">' +
        (isSignupCase ? signUpText : submitText) +
        "</button></div>" +
        '<div aria-live="assertive" class="message_box">' +
        '<div id="error_box"></div>' +
        '<div id="loading_div">' +
        verifyingMessage +
        "...........<br>" +
        "</div>" +
        "</div></form>");
}

function inviteOnlyEmailVerificationCallback(a) { }
function inviteOnlyEmailVerificationobject() {
    this.render = renderHtml;
}
window["inviteOnlyEmailVerification"] = new inviteOnlyEmailVerificationobject();
window["loadInviteOnlyEmailVerificationChallengeWidget"]();
var eventId = window.queueViewModel.eventId;
var customerId = window.queueViewModel.customerId;
var queuePathPrefix = "";
if (window.queueViewModel.queuePathPrefix) {
    queuePathPrefix = window.queueViewModel.queuePathPrefix;
    queuePathPrefix =
        queuePathPrefix[0] === "/" ? queuePathPrefix : "/" + queuePathPrefix;
}
var baseURL = window.location.origin + queuePathPrefix + "/inviteonly";
var cultureId = "";
var identifierValue = "";
var identifierListId = "";
var emailPlaceholder = "";
var codePlaceholder = "";
var submitText = "";
var signUpText = "";
var isSignupCase = false;
var isCustomCode = false;
var skipUiValidation = false;
var verifyingMessage = "";
$("#three-bar-loader-container").hide();
function renderHtml(containerId, parameters) {
    var primaryColor = "#19be81";
    var primaryTextColor = "#000";
    var boxColor = "#fff ";
    var bodyBackgroundColour = $("body").css("background-color");
    if (bodyBackgroundColour !== "#e0e0e0" &&
        bodyBackgroundColour !== "rgb(224, 224, 224)" &&
        bodyBackgroundColour !== "rgba(0, 0, 0, 0)" &&
        bodyBackgroundColour !== "") {
        primaryColor = bodyBackgroundColour;
    }
    var css = getStyles(boxColor, primaryTextColor, primaryColor);
    setChallengeStyles(css);
    var bodyTextColour = $("body").css("color");
    if (bodyTextColour !== "" && bodyTextColour !== "rgb(0, 0, 0)") {
        primaryTextColor = bodyTextColour;
    }
    checkPermissionCollectionEnabledOnEvent();
    inviteOnlyEmailVerificationCallback =
        parameters.InviteOnlyEmailVerificationCallback;
    cultureId = parameters.culture;
    var culturalStrings = getCulturalStrings(cultureId);
    setCulture(culturalStrings);
    document.getElementById(containerId).innerHTML = isCustomCode
        ? getCustomCodeScreen(codePlaceholder, submitText, verifyingMessage)
        : getEmailScreen(isCustomCode, isSignupCase, codePlaceholder, emailPlaceholder, signUpText, submitText, verifyingMessage);
    checkCustomCodeEnabledForCustomer(containerId);
}
function checkPermissionCollectionEnabledOnEvent() {
    var emailFromUrl = getParameterByName("email");
    $("#error_box").html("");
    makeAjaxRequestWithRetriesAndJitter(baseURL + "/check-permission-collection", "POST", JSON.stringify({
        waitingRoomId: eventId,
        customerId: customerId,
    }), function (data) {
        isSignupCase = data.isPermissionCollectionEnabled;
        if (isSignupCase == true) {
            $("#btnSubmit_Email").html(signUpText);
        }
        if (emailFromUrl != "" && emailFromUrl != undefined) {
            document.getElementById("invitee_email").value =
                emailFromUrl;
            verifyEmailGetCode(new Event("submit"));
        }
    }, function () {
        $("#error_box").html("An error occured while fetching waiting room information");
    });
}
function verifyEmailGetCode(event) {
    event.preventDefault();
    identifierValue = document.getElementById("invitee_email").value.trim();
    if (identifierValue == "") {
        $("#error_box").html("Invalid email format");
        return;
    }
    $("#loading_div").show();
    $("#error_box").html("");
    makeAjaxRequestWithRetriesAndJitter(baseURL + (isSignupCase ? "/send-email" : "/check-invite"), "POST", JSON.stringify({
        identifierValue: identifierValue,
        waitingRoomId: eventId,
        customerId: customerId,
        Culture: cultureId,
    }), function (data) {
        $("#loading_div").hide();
        if (!data.success) {
            $("#error_box").html(data.responseMessage);
            return;
        }
        if (data.enqueueToken !== null &&
            data.enqueueToken != undefined) {
            var a = {
                type: "success",
                sessionId: eventId,
                challengeDetails: "InviteOnlyEmailVerification",
                solution: data.enqueueToken,
                solverStats: null,
            };
            inviteOnlyEmailVerificationCallback(a);
            return;
        }
        identifierListId = data.identifierListId;
        document.getElementById("challenge-container").innerHTML = getCodeScreen(data.responseMessage, codePlaceholder, submitText, verifyingMessage);
        document.getElementById("invitee_code").focus();
        return;
    }, function () {
        $("#loading_div").hide();
        $("#error_box").html("An error occured while verifying your email. Please try again");
    });
}
function verifyCode(event) {
    event.preventDefault();
    var code = document.getElementById("invitee_code")
        .value;
    $("#loading_div_code").show();
    $("#error_box_code").html("");
    makeAjaxRequestWithRetriesAndJitter(baseURL + "/verify-identifier", "POST", JSON.stringify({
        identifierValue: identifierValue,
        waitingRoomId: eventId,
        customerId: customerId,
        IdentifierListId: identifierListId,
        VerificationCode: code,
        Culture: cultureId,
        AddInviteeToList: isSignupCase,
    }), function (data) {
        $("#loading_div_code").hide();
        if (data.status === "success") {
            var a = {
                type: "success",
                sessionId: eventId,
                challengeDetails: "InviteOnlyEmailVerification",
                solution: data.enqueueToken,
                solverStats: null,
            };
            inviteOnlyEmailVerificationCallback(a);
        }
        else {
            $("#error_box_code").html(data.responseMessage);
        }
    }, function () {
        $("#loading_div_code").hide();
        $("#error_box_code").html("An error occured while verifying the code. Please try again");
    });
}
function checkCustomCodeEnabledForCustomer(containerId) {
    var customCodeFromUrl = getParameterByName("code");
    $("#error_box").html("");
    makeAjaxRequestWithRetriesAndJitter(baseURL + "/check-custom-code", "POST", JSON.stringify({
        customerId: customerId,
    }), function (data) {
        isCustomCode = data.isCustomCode;
        skipUiValidation = data.skipUiValidation;
        if (isCustomCode == true &&
            skipUiValidation == true &&
            customCodeFromUrl != "" &&
            customCodeFromUrl != undefined) {
            document.getElementById(containerId).innerHTML = getCustomCodeScreen(codePlaceholder, submitText, verifyingMessage);
            document.getElementById("invitee_customcode").value = customCodeFromUrl;
            verifyCustomCode(new Event("submit"));
        }
        else if (isCustomCode == true && skipUiValidation == true) {
            document.getElementById(containerId).innerHTML = getCustomCodeScreen(codePlaceholder, submitText, verifyingMessage);
        }
    }, function () {
        $("#error_box").html("An error occured while fetching waiting room information");
    });
}
function verifyCustomCode(event) {
    event.preventDefault();
    var customCode = document.getElementById("invitee_customcode").value.trim();
    if (customCode == "") {
        $("#error_box").html("Invalid code");
        return;
    }
    $("#loading_div").show();
    $("#error_box").html("");
    makeAjaxRequestWithRetriesAndJitter(baseURL + "/verify-custom-code", "POST", JSON.stringify({
        customCode: customCode,
        waitingRoomId: eventId,
        customerId: customerId,
    }), function (data) {
        $("#loading_div").hide();
        if (data.success &&
            data.enqueueToken !== null &&
            data.enqueueToken != undefined) {
            var a = {
                type: "success",
                sessionId: eventId,
                challengeDetails: "InviteOnlyEmailVerification",
                solution: data.enqueueToken,
                solverStats: null,
            };
            inviteOnlyEmailVerificationCallback(a);
            return;
        }
        $("#error_box").html(data.responseMessage);
    }, function () {
        $("#loading_div").hide();
        $("#error_box").html("An error occured while verifying your email. Please try again");
    });
}
function setCulture(culture) {
    emailPlaceholder = culture.emailPlaceholder;
    codePlaceholder = culture.codePlaceholder;
    verifyingMessage = culture.verifyingMessage;
    submitText = culture.submitText;
    signUpText = culture.signUpText;
}
