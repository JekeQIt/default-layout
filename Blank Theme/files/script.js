queueViewModel.pageReady(function (data) {
  var pageid = $("body").attr("data-pageid");
  var culture = $("body").attr("data-culture");
  //  $(".logo").insertBefore("#main");

  if (pageid == "before") {
  }

  if (pageid == "queue") {
  }

  if (pageid == "after") {
  }

  if (pageid == "error") {
    var errorid = $("body").attr("data-errorid");

    if (errorid == "4") {
    }

    if (errorid == "5") {
    }
  }
});

queueViewModel.modelUpdated(function (data) {
  // console.log(data.ticket.expectedServiceTime);
});
