$(document).ready(function () {
  if (queueViewModel.eventId === "preview-layout" || queueViewModel.eventId === "testevent") {
    console.log("preview");
    var pageid = $("body").attr("data-pageid");

    if (pageid == "queue") {
      $("#reminderStatusMesage").after(
        `
        <label class="cblabel queueElement">
        <input type="range" value="75" id="progressWidthInput" max="100" min="0" />
        <span class="title">&nbsp Width of progress bar</span>
        <span class="qmark"
          >?
          <span class="tooltip">Change the width of the progress bar</span>
        </span>
      </label>
      <label class="cblabel queueElement">
        <input class="update-state" type="checkbox" />
        Progessbar updating state
        <span class="qmark"
          >?
          <span class="tooltip">Click to see the progressbar in the updating state</span>
        </span>
      </label>
      <label class="cblabel queueElement">
        <input class="invite-only-preview" type="checkbox" />
        Invite Only
      </label>
      <div class="invite-only-sub-container ">
        <label class="cblabel queueElement">
          <input class="iowr-email-error" type="checkbox" />
         Email Error
        </label>
        <label class="cblabel queueElement">
          <input class="iowr-email-success" type="checkbox" />
         Email Success
        </label>
          <label class="cblabel queueElement">
            <input class="iowr-code-error" type="checkbox" />
           Code Error
          </label>
      </div>

        `
      );

      //prgressbar length
      $("#progressWidthInput").change(function () {
        var inputWidth = $("#progressWidthInput").val();
        console.log(inputWidth);
        $("#MainPart_divProgressbar_Progress")
          .removeAttr("style")
          .attr("style", "width:" + inputWidth + "%");
      });
      //updating state checkbox
      $(".update-state").change(function () {
        if (!$("#MainPart_divProgressbar_Progress").hasClass("updated")) {
          console.log("adding updated class.");
          $("#MainPart_divProgressbar_Progress").addClass("updated");
        } else {
          $("#MainPart_divProgressbar_Progress").removeClass("updated");
        }
      });
      //do something when paused button clicked.
      $("#PreviewStatesContent label:nth-child(4) input").click(function () {
        if ($("#PreviewStatesContent label:nth-child(4) input")[0].checked === true) {
          console.log("selected");
        }
        if ($("#PreviewStatesContent label:nth-child(4) input")[0].checked === false) {
          console.log("not selected");
        }
      });
    }
    //invite only
    //updating state checkbox
    $(".invite-only-sub-container").hide();

    $(".invite-only-preview").change(function () {
      console.log("invite only active", $(".invite-only-sub-container").css("display"));
      // Create invite only elements
      if ($(".invite-only-sub-container").css("display") === "none") {
        if ($("#divChallenge").length === 0) {
          $(`
          <div id="divChallenge">
      <div id="divChallenge_Content">
        <div id="challenge-widget-container">
          <div id="challenge-container">
            <form onsubmit="verifyEmailGetCode(event)">
              <div id="main_invite_div">
                <label for="invitee_email" id="lblEmail">Please enter email</label>
                <div class="input_box">
                  <input
                    area-label="email"
                    placeholder="Please enter email"
                    type="text"
                    id="invitee_email"
                    required=""
                    autofocus=""
                    autocomplete=""
                    data-keeper-lock-id="k-5v201q18jio"
                  /><button class="btn" type="submit" id="btnSubmit_Email">Submit</button
                  ><keeper-lock
                    class="focus-visible keeper-lock-disabled"
                    tabindex="0"
                    id="k-5v201q18jio"
                    aria-label="Open Keeper Popup"
                    role="button"
                    style="
                      background-image: url('chrome-extension://bfogiafebfohielmmehodmfbbebbbpei/images/ico-field-fill-lock-disabled.svg') !important;
                      background-size: 24px 24px !important;
                      cursor: pointer !important;
                      width: 24px !important;
                      position: absolute !important;
                      opacity: 0 !important;
                      margin-top: auto !important;
                      min-width: 24px !important;
                      top: 31.5px;
                      left: 298.438px;
                      z-index: 1;
                      padding: 0px;
                      height: 24px !important;
                    "
                  ></keeper-lock>
                </div>
                <div aria-live="assertive" class="message_box">
                  <div id="error_box"></div>
                  <div id="loading_div" class="hidden">Verifying Please wait...........<br /></div>
                </div>
              </div>
            </form>
          </div>
          <div class="hidden" id="three-bar-loader-container" style="display: none">
            <div class="three-bar-loader"></div>
            <div class="three-bar-loader"></div>
            <div class="three-bar-loader"></div>
          </div>
        </div>
      </div>
    </div>
        `).insertAfter("#divConfirmRedirectModal");
        }
        if ($("#divChallenge").length > 0) {
          $("#divChallenge").show();
        }
        $(".invite-only-sub-container").show();
        $("body").addClass("key-required");
        $("#header, #MainPart_divProgressbar, #MainPart_divProgressbarBox, #MainPart_frmReminder2").hide();
      } else {
        $("#divChallenge").hide();
        $("body").removeClass("key-required");
        $(".invite-only-sub-container").hide();
        $("#header, #MainPart_divProgressbar, #MainPart_divProgressbarBox, #MainPart_frmReminder2").show();
      }

      // Email error checkbox
      $(".iowr-email-error").change(function () {
        if ($(".iowr-email-error").prop("checked")) {
          //uncheck code error
          if ($(".iowr-code-error").prop("checked")) {
            $(".iowr-code-error").trigger("click");
          }
          //uncheck email success
          if ($(".iowr-email-success").prop("checked")) {
            $(".iowr-email-success").trigger("click");
          }
          $("#error_box").show();
          $("#error_box").html(`Your email cannot be verified. Please enter the email registered for this event.`);
        } else {
          $("#error_box").hide();
        }
      });
      // Email success checkbox
      $(".iowr-email-success").change(function () {
        if ($(".iowr-email-success").prop("checked") === true) {
          //uncheck email error
          if ($(".iowr-email-error").prop("checked")) {
            $(".iowr-email-error").trigger("click");
          }
          //uncheck code error
          if ($(".iowr-code-error").prop("checked")) {
            $(".iowr-code-error").trigger("click");
          }
          //if code_message element doesnt exist, create it. If exists, show()
          if ($("#code_message").length === 0) {
            $(`<div id="code_message">A six-digit verification code has been sent to your email. Please submit the code above.</div>`).insertAfter(
              ".input_box"
            );
          } else {
            $("#code_message").show();
          }
        } else {
          $("#code_message").hide();
        }
      });
      // IO Code error checkbox
      $(".iowr-code-error").change(function () {
        if ($(".iowr-code-error").prop("checked") === true) {
          //uncheck email error
          if ($(".iowr-email-error").prop("checked")) {
            $(".iowr-email-error").trigger("click");
          }
          //uncheck email success
          if ($(".iowr-email-success").prop("checked")) {
            $(".iowr-email-success").trigger("click");
          }
          //if Error box code element doesnt exist, create it. If exists, show()
          if ($("#error_box_code").length === 0) {
            $(`<div id="error_box_code">The code you provided is incorrect. Try again.</div>`).insertAfter(".input_box");
          } else {
            $("#error_box_code").show();
          }
        } else {
          $("#error_box_code").hide();
        }
      });
    });
    $(".invite-only-sub-container ").css("margin-left", "20px");
  }
});
// var once = true;
// queueViewModel.modelUpdated(function (data) {
//   if (once) {
//     console.log(data);
//     once = false;
//   }
// });
