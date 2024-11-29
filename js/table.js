/*
name: Ryan Gutierrez
github: gutzq
email: ryan_gutierrez@uml.student.edu
*/

$(document).ready(function () {

  $.validator.addMethod("wholeNumber", function (value, element) {
    return this.optional(element) || Number.isInteger(parseFloat(value));
  }, "Please enter a whole number.");

  $.validator.addMethod("validRange", function (value, element, params) {
    const min = parseInt($(params[0]).val(), 10);
    const max = parseInt(value, 10);
    return this.optional(element) || min <= max;
  }, "The minimum value must be less than or equal to the maximum value.");

  $("#tableform").validate({
    rules: {
      "minimum-multiplier": {
        required: true,
        number: true,
        wholeNumber: true,
        range: [-50, 50]
      },
      "maximum-multiplier": {
        required: true,
        number: true,
        wholeNumber: true,
        range: [-50, 50],
        validRange: ["#startMultiplier"]
      },
      "minimum-multiplicand": {
        required: true,
        number: true,
        wholeNumber: true,
        range: [-50, 50]
      },
      "maximum-multiplicand": {
        required: true,
        number: true,
        wholeNumber: true,
        range: [-50, 50],
        validRange: ["#startMultiplicand"]
      }
    },
    messages: {
      "minimum-multiplier": "Please enter a valid whole number between -50 and 50.",
      "maximum-multiplier": "Please ensure the maximum is >= the minimum and within -50 to 50.",
      "minimum-multiplicand": "Please enter a valid whole number between -50 and 50.",
      "maximum-multiplicand": "Please ensure the maximum is >= the minimum and within -50 to 50."
    },
    errorPlacement: function (error, currentElement) {
      if (currentElement.attr("id") === "startMultiplier" || currentElement.attr("id") === "endMultiplier") {
        $("#multiplier-error").html(error);
      } else if (currentElement.attr("id") === "startMultiplicand" || currentElement.attr("id") === "endMultiplicand") {
        $("#multiplicand-error").html(error);
      } else {
        error.insertAfter(currentElement);
      }
    }
  });

  $("#startMultiplier, #endMultiplier, #startMultiplicand, #endMultiplicand").each(function () {
    let input = $(this);
    let slider = $("<div>").insertAfter(input).slider({
      min: -50,
      max: 50,
      value: parseInt(input.val()) || 0,
      slide: function (event, ui) {
        input.val(ui.value).trigger("change");
      }
    });
    input.on("input change", function () {
      slider.slider("value", this.value);
    });
  });


  let tabs = $("#tabs").tabs();
  let tabIndex = 0;

  function addTab(tableHtml, parameters) {
      tabIndex++;
      const tabId = `tab-${tabIndex}`;
      const tabTitle = `${parameters.minX}-${parameters.maxX}, ${parameters.minY}-${parameters.maxY}`;

      $("<li><a href='#" + tabId + "'>" + tabTitle + "</a><button class='close-tab'>x</button></li>")
          .appendTo(tabs.find(".ui-tabs-nav"));
      $("<div id='" + tabId + "' class='tab-content'>" + tableHtml + "</div>").appendTo(tabs);

      tabs.tabs("refresh");

      $(".close-tab").off("click").on("click", function (){
          const panelId = $(this).closest("li").remove().attr("aria-controls");
          $("#" + panelId).remove();
          tabs.tabs("refresh");
      });
  }

  function generateTable() {
    const minX = parseInt($("#startMultiplier").val());
    const maxX = parseInt($("#endMultiplier").val());
    const minY = parseInt($("#startMultiplicand").val());
    const maxY = parseInt($("#endMultiplicand").val());

    if (minX < -50 || minX > 50 || maxX < -50 || maxX > 50 || minY < -50 || minY > 50 || maxY < -50 || maxY > 50) {
      alert("Please ensure all numbers are within the valid range of -50 to 50.");
      return "";
    }

    if (minX > maxX || minY > maxY) {
      alert("Minimum values must be less than or equal to the maximum values.");
      return "";
    }

    let table = "<table>";
    for (let r = minY - 1; r <= maxY; r++) {
      table += "<tr>";
      for (let c = minX - 1; c <= maxX; c++) {
        if (r === minY - 1 && c === minX - 1) {
          table += "<th></th>";
        } else if (r === minY - 1) {
          table += `<th>${c}</th>`;
        } else if (c === minX - 1) {
          table += `<th>${r}</th>`;
        } else {
          table += `<td>${r * c}</td>`;
        }
      }
      table += "</tr>";
    }
    table += "</table>";
    return table;
  }

  $("input[type='button']").click(function() {
    if ($("#tableform").valid()) {
      const tableHtml = generateTable();
      const parameters = {
        minX: parseInt($("#startMultiplier").val()),
        maxX: parseInt($("#endMultiplier").val()),
        minY: parseInt($("#startMultiplicand").val()),
        maxY: parseInt($("#endMultiplicand").val())
      };
      if(tableHtml) {
        addTab(tableHtml, parameters);
      }
    }
  });
});

