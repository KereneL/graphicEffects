export default function init() {
  var activeEffect;
  var activeLayer;
  var divs = []

  divs.push(...$("#bayer-effect, #gamma-effect, #channels-effect"))
  function hideAllEffectDivs() {
    divs.forEach(div => {
      $(div).hide();
    })
  }

  $("#toolbox-list-acc, #layers-list-acc").accordion({
    collapsible: true,
    classes: {
      "ui-accordion-header": "",
      "ui-accordion-header-collapsed": "",
      "ui-corner-bottom": "",
    },
    activate: function( event, ui ){
      hideAllEffectDivs();
    }
  })

  $("#bayer-effect").data("default", { name: "bayer", displayName: "Bayer Matrix", n: 1, spread: 0.5 })
  $("#bayer-effect").data("config", Object.assign({},$("#bayer-effect").data("default")))
  $("#bayer-select").selectmenu({
    create: function (event, ui) {
      $(this).val("1");
      $("#bayer-effect").data("config").n = $(this).val()
      $(this).selectmenu("refresh");
    },
    change: function (event, ui) {
      $("#bayer-effect").data("config").n = ui.item.value;
      activeLayer.data("config", Object.assign({},$("#bayer-effect").data("config")))
    },
  })
  $("#bayer-spread-slider").slider({
    min: 0,
    max: 4,
    step: 0.1,
    value: 0.5,
    create: function () {
      $("#bayer-spread-handle").text($(this).slider("value"));
      $("#bayer-effect").data("config").spread = 0.5;
    },
    slide: function (event, ui) {
      $("#bayer-spread-handle").text(ui.value);
      $("#bayer-effect").data("config").spread = ui.value;
      activeLayer.data("config", $("#bayer-effect").data("config"))
    },
  });
  $("#bayer-effect").data("load", (configObj)=>{
    $("#bayer-effect").data("config", configObj)
    $("#bayer-select").val(configObj.n).selectmenu("refresh")
    $("#bayer-spread-slider").slider({value: configObj.spread})
    let left = (configObj.spread / $("#bayer-spread-slider").slider( "option", "max" ));
    $("#bayer-spread-handle").css("left",`${left*100}%`)
    $("#bayer-spread-handle").text(configObj.spread);
  })


  $("#gamma-effect").data("default", { name: "gamma", displayName: "Gamma", value: 1})
  $("#gamma-effect").data("config", Object.assign({},$("#gamma-effect").data("default")))
  $("#gamma-slider").slider({
    min: 0,
    max: 10,
    step: 0.25,
    value: 1,
    create: function () {
      $("#gamma-handle").text($(this).slider("value"));
      $("#gamma-effect").data("config").value = 1;
    },
    slide: function (event, ui) {
      $("#gamma-handle").text(ui.value);
      $("#gamma-effect").data("config").value = ui.value;
      activeLayer.data("config", Object.assign({},$("#gamma-effect").data("config")))
    }
  });
  $("#gamma-effect").data("load", (configObj)=>{
    $("#gamma-effect").data("config", configObj)
    $("#gamma-slider").slider({value: configObj.value})
    let left = (configObj.value / $("#gamma-slider").slider( "option", "max" ));
    $("#gamma-handle").css("left",`${left*100}%`)
    $("#gamma-handle").text(configObj.value)
  })


  $("#channels-effect").data("default", { "name": "channels", displayName: "Channels", "r": true, "g": true, "b": true, "gs": false })
  $("#channels-effect").data("config", Object.assign({},$("#channels-effect").data("default")))

  $("#channels-effect").data("load", (configObj)=>{
    $("#channels-effect").data("config", configObj)
    $("#checkbox-r").prop("checked", configObj.r).checkboxradio("refresh")
    $("#checkbox-g").prop("checked", configObj.g).checkboxradio("refresh")
    $("#checkbox-b").prop("checked", configObj.b).checkboxradio("refresh")
    $("#checkbox-gs").prop("checked", configObj.gs).checkboxradio("refresh")
  })
  $("#channels-fs").controlgroup({
    "direction": "vertical"
  });
  $("#checkbox-r").checkboxradio({ label: "Red" })
    .prop("checked", true)
    .checkboxradio("refresh");
  $("#checkbox-g").checkboxradio({ label: "Green" })
    .prop("checked", true)
    .checkboxradio("refresh");
  $("#checkbox-b").checkboxradio({ label: "Blue" })
    .prop("checked", true)
    .checkboxradio("refresh");
  $("#checkbox-gs").checkboxradio({ label: "Grayscale" })
    .prop("checked", false)
    .checkboxradio("refresh");
  function disableGrayscaleChannel() {
    $("#checkbox-gs").prop("checked", false);
    $("#channels-effect").data("config").gs = false
    $("#checkbox-gs").checkboxradio("refresh")
  }
  $("#checkbox-r").change(function () {
    let state = $(this).prop("checked")
    if (state) disableGrayscaleChannel()
    $("#channels-effect").data("config").r = state
    activeLayer.data("config", Object.assign({},$("#channels-effect").data("config")))
  })
  $("#checkbox-g").change(function () {
    let state = $(this).prop("checked")
    if (state) disableGrayscaleChannel();
    $("#channels-effect").data("config").g = state
    activeLayer.data("config", Object.assign({},$("#channels-effect").data("config")))
  });
  $("#checkbox-b").change(function () {
    let state = $(this).prop("checked")
    if (state) disableGrayscaleChannel();
    $("#channels-effect").data("config").b = state
    activeLayer.data("config", Object.assign({},$("#channels-effect").data("config")))
  });
  $("#checkbox-gs").change(function () {
    let state = $(this).prop("checked")
    colChannels(!state)
    $("#channels-effect").data("config").gs = state
    activeLayer.data("config", Object.assign({},$("#channels-effect").data("config")))
  })

  $(document).on("click", "span.delete-handle", function (event, ui) {
    event.preventDefault();
    let toBeRemoved = $(this).closest("li")
    
    if (toBeRemoved.hasClass("ui-selected")) {
      activeEffect = undefined;
      activeLayer = undefined;
      hideAllEffectDivs();
    }
      toBeRemoved.remove();
      if ($("#layers-list").children(".ui-selected").length != 0){
        let selectedTop = $("#layers-list").children(".ui-selected").eq(0)
        let topValue =  0 + selectedTop.offset().top
        activeEffect.css({"top": topValue})
      }
    }
    );
  $("#layers-list")
    .sortable({
      handle: ".drag-handle",
      placeholder: "ui-sortable-placeholder ui-state-highlight layer-list-placeholder",
      appendTo: $("main"),
      opacity: 0.7,
      helper: "original",
      revert: 64,
    })
    .selectable({
      filter: "li",
      cancel: "span",
      selected: function (event, ui) {
        $(ui.selected).addClass("ui-selected").siblings().removeClass("ui-selected").each(
          function (key, value) {
            $(value).find("*").removeClass("ui-selected");
          }
        );
        activeLayer = $(ui.selected)
        let type = activeLayer.data("type")
        activeEffect = $(`#${type}-effect`)
        let positionRight = $("#toolbox").width()
        let positionTop = activeLayer.offset().top
        activeEffect.css({ "right": positionRight, "top": positionTop });
        let data = activeLayer.data("config")
        activeEffect.data("load")(data);
        hideAllEffectDivs();
        activeEffect.show();
      },
      unselected: function (event, ui) {
        activeLayer = undefined;
        activeEffect = undefined;
        hideAllEffectDivs();
      }
    })

  $("#effects").selectmenu({
    change: function (event, ui) {
      if (ui.item.value == "none") return;

      hideAllEffectDivs();

      let newItem = $(`
          <li class="ui-state-default layer-row ui-selected">
            <div class="layer-start">
                <span class="drag-handle">&equiv;</span><label>${ui.item.label}</label>
            </div>
            <div class="layer-end">
                <span class="delete-handle">&#10005;</span>
            </div>
          </li>
          `)
      newItem.data("type", ui.item.value)
      $("#layers-list").append(newItem);
      newItem.siblings(".ui-selected").removeClass("ui-selected")
      let type = ui.item.value
      
      activeLayer = newItem
      activeEffect = $(`#${type}-effect`)
      activeLayer.data("config", Object.assign({}, activeEffect.data("default")));
      let data = activeLayer.data("config")
      activeEffect.data("load")(data)
      $("#layers-list").scrollTop($("#layers-list")[0].scrollHeight);
      let positionRight = $("#toolbox").width()
      let positionTop = newItem.offset().top
      activeEffect.css({ "right": positionRight, "top": positionTop });
      $("#layers-list").selectable("refresh")
      hideAllEffectDivs();
      activeEffect.show();
    },
    close: function (event, ui) {
      $(this).val("none")
      $(this).selectmenu("refresh");
    },
    create: function (event, ui) {
      $(this).val("none");
      $(this).selectmenu("refresh");
    }
  });

  let inputObj = p5Obj.createFileInput(handleFile);
  $(inputObj.elt).attr("id", "file-upload");
  $(inputObj.elt).hide();

  $("#toolbox-list-acc, #layers-list-acc, ul, li").disableSelection();
  hideAllEffectDivs();
  p5Obj.redraw = redraw;
}

function redraw() {
  const algo = [];
  let children = $("#layers-list").children();
  children.each(
    function (index, element) {
      let effectConfig = $(element).data("config")
      if (!effectConfig) return;
      else algo.push(effectConfig)
    });
  startAlgo(algo)
}
function colChannels(checked) {
  $("#channels-effect").data("config").r = checked;
  $("#channels-effect").data("config").g = checked;
  $("#channels-effect").data("config").b = checked;
  $("#checkbox-r").prop("checked", checked).checkboxradio("refresh");
  $("#checkbox-g").prop("checked", checked).checkboxradio("refresh");
  $("#checkbox-b").prop("checked", checked).checkboxradio("refresh");
}