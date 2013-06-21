$(document).ready(function(){

  // Global variables.
  PageTitle = "JsSIP Tryit";
  document.title = PageTitle;

  register_checkbox = $("#phone > .status #register");
  phone_dialed_number_screen = $("#phone > .controls  input.destination");
  phone_call_button = $("#phone > .controls > .dialbox > .dial-buttons > .call");
  phone_chat_button = $("#phone > .controls > .dialbox > .dial-buttons > .chat");
  phone_dialpad_button = $("#phone > .controls > .dialpad .button");
  soundPlayer = document.createElement("audio");
  soundPlayer.volume = 1;


  // Local variables.

  var display_name = null;
  var sip_uri = null;
  var sip_password = null;
  var ws_servers = null;

  var ws_was_connected = false;

  var login_form = $("#login-form");
  var login_inputs = $("#login-form input");
  var login_display_name = $("#login-form input#display_name");
  var login_sip_uri = $("#login-form input#sip_uri");
  var login_sip_password = $("#login-form input#sip_password");
  var login_ws_servers = $("#login-form input#ws_servers");
  var login_Y_U_NO = $("#Y_U_NO");
  var login_Y_U_NO_text = $("#Y_U_NO p");
  var login_advanced_settings_link = $("#advanced-settings-link a");
  var login_advanced_settings = $("#advanced-settings");
  var login_advanced_settings_close = $("#advanced-settings .close");
  var login_advanced_settings_form = $("#advanced-settings-form");
  var login_use_trit_account_link = $("#use-tryit-account-link a");
  var login_form_from_invitation = $("#login-form-from-invitation");
  var login_display_name_from_invitation = $("#login-form-from-invitation input.display_name");
  var div_webcam = $("div#webcam");
  var balloons = $("a.balloon");
  var theme01 = $("#themes > div.theme01");
  var theme02 = $("#themes > div.theme02");
  var theme03 = $("#themes > div.theme03");
  var theme04 = $("#themes > div.theme04");

  // Tryit JsSIP data.
  var tryit_sip_domain = "tryit.jssip.net";
  var tryit_ws_uri = "ws://ws.tryit.jssip.net:10080";
  var invitation_link_pre = "http://tryit.jssip.net?invited-by="


  // Initialization.
  login_display_name.focus();
  login_ws_servers.val(tryit_ws_uri);


  login_advanced_settings_link.click(function() {
    login_advanced_settings_link.hideBalloon();
    login_advanced_settings.fadeIn(300);
    return false;
  });

  login_advanced_settings_close.click(function() {
    login_advanced_settings.fadeOut(300);
  });


  // Balloons.

  balloons.click(function() { return false; });

  $("a.balloon.display_name").balloon(getBalloonContent("login_display_name"));
  $("a.balloon.sip_uri").balloon(getBalloonContent("login_sip_uri"));
  $("a.balloon.sip_password").balloon(getBalloonContent("login_sip_password"));
  $("a.balloon.ws_uri").balloon(getBalloonContent("login_ws_uri"));
  login_advanced_settings_link.balloon(getBalloonContent("login_advanced_settings"));
  login_use_trit_account_link.balloon(getBalloonContent("login_login_use_trit_account"));


  login_form.submit(function() {
    login_advanced_settings.hide();
    try {
      phoneInit();
    } catch(err) {
      console.warn(err.toString());
      alert(err.toString());
    }
    return false;
  });


  login_advanced_settings_form.submit(function() {
    login_advanced_settings.hide();
    try {
      phoneInit();
    } catch(err) {
      console.warn(err.toString());
      alert(err.toString());
    }
    return false;
  });


  login_use_trit_account_link.click(function() {
    showFormFromInvitation();
    return false;
  });


  login_form_from_invitation.submit(function() {
    login_display_name.val(login_display_name_from_invitation.val());
    useTryitAccount();
    phone_dialed_number_screen.val(invitedBy);
    phone_chat_button.click();
    return false;
  });


  // If there is a custom js/custom.js file then load it and directly use its JsSIP configuration.
  //$.getScript("js/custom.js", function(data, textStatus, jqxhr) {
  if (window.CustomJsSIPSettings) {
    console.info("*** CustomJsSIPSettings found in js/custom.js, bypassing login form...");

    login_display_name.val(CustomJsSIPSettings.display_name);
    login_sip_uri.val(CustomJsSIPSettings.uri);
    login_sip_password.val(CustomJsSIPSettings.password);
    login_ws_servers.val(CustomJsSIPSettings.ws_servers);

    login_form.submit();
  }


  function getBalloonContent(item) {
    var balloon_text;

    switch (item)
    {
    case "login_display_name":
      balloon_text = "<p>Your common name</p>";
      break;
    case "login_sip_uri":
      balloon_text = "<p>Your SIP account URI</p>";
      break;
    case "login_sip_password":
      balloon_text = "<p>Your SIP account password</p>";
      break;
    case "login_ws_uri":
      balloon_text = "<p>Your SIP WebSocket server URI</p><p>Don't have one? Use our own OverSIP server to connect to your SIP domain!</p>";
      break;
    case "login_advanced_settings":
      balloon_text = "<p>Set JsSIP advanced settings</p>";
      break;
    case "login_login_use_trit_account":
      balloon_text = "<p>Click here to generate an account at our SIP and WebSocket servers</p><p>...and just enjoy!</p>";
      break;
    }

    return {
      contents: balloon_text,
      minLifetime: 100,
      classname: 'balloonTip',
      css: {
        border: 'solid 1px #FF2D66',
        padding: '4px 10px',
        fontSize: '100%',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: '2',
        backgroundColor: '#666',
        color: '#fff'
      }
    };
  }


  function getRandomUsername() {
    var user =  'xxxxxxxx'.replace(/[x]/g, function(c) {
      var r = window.Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });

    return user;
  }


  function useTryitAccount() {
    login_sip_uri.val("sip:" + getRandomUsername() + "@" + tryit_sip_domain);
    login_sip_password.val("");
    login_ws_servers.val(tryit_ws_uri);

    login_form.submit();
  }


  function Y_U_NO(text, timeout) {
    timeout = timeout || 2000;

    login_Y_U_NO_text.text(text);
    login_Y_U_NO.show();
    login_Y_U_NO.fadeOut(timeout, function() {
      $(this).hide();
    });

    login_inputs.prop('disabled', true);
    window.setTimeout(function() {
        login_inputs.prop('disabled', false);
        login_Y_U_NO.hide();
      },
      timeout
    );
  }


  // If it's an invitation automatically log-in.
  var currentURL = parseUri(window.location.toString());
  var invitedBy = currentURL.queryKey["invited-by"];
  if (invitedBy) {
    showFormFromInvitation();
  }


  function showFormFromInvitation() {
    login_form.hide();
    login_advanced_settings_link.hide();
    login_use_trit_account_link.hide();
    login_form_from_invitation.show();
    login_display_name_from_invitation.focus();
  }


  function phoneInit() {
    var configuration;

    // If js/custom.js was found then use its CustomJsSIPSettings object.
    if (window.CustomJsSIPSettings) {
      configuration = CustomJsSIPSettings;
    }

    // Otherwise load data from the forms.
    else {
      if (login_display_name.val() != "")
        display_name = login_display_name.val();
      if (login_sip_uri.val() != "")
        sip_uri = login_sip_uri.val();
      if (login_sip_password.val() != "")
        sip_password = login_sip_password.val();
      if (login_ws_servers.val() != "") {
        ws_servers = login_ws_servers.val();
        // To JSON (in case of a simple string we must enclose between ").
        if (ws_servers) {
          if (ws_servers.charAt(0) != "[")
            ws_servers = '"' + ws_servers + '"'
          ws_servers = window.JSON.parse(ws_servers);
        }
      }

      if (! sip_uri) {
        Y_U_NO("Y U NO SIP URI ?");
        return false;
      }
      else if (! ws_servers) {
        Y_U_NO("Y U NO WS URI ?");
        return false;
      }

      // Advanced Settings.

      var authorization_user = $("#advanced-settings-form input[name$='authorization_user']").val();
      var register = $("#advanced-settings-form input[name$='register']").is(':checked');
      var register_expires = window.parseInt($("#advanced-settings-form input[name$='register_expires']").val());
      var registrar_server = $("#advanced-settings-form input[name$='registrar_server']").val();
      var no_answer_timeout = window.parseInt($("#advanced-settings-form input[name$='no_answer_timeout']").val());
      var trace_sip = $("#advanced-settings-form input[name$='trace_sip']").is(':checked');
      var stun_servers = $("#advanced-settings-form input[name$='stun_servers']").val();
      // To JSON (in case of a simple string we must enclose between ").
      if (stun_servers) {
        if (stun_servers.charAt(0) != "[")
          stun_servers = '"' + stun_servers + '"'
        stun_servers = window.JSON.parse(stun_servers);
      }
      var turn_servers = $("#advanced-settings-form input[name$='turn_servers']").val();
      // To JSON (in case of a simple string we must enclose between ").
      if (turn_servers) {
        if (turn_servers.charAt(0) != "[")
          turn_servers = '"' + turn_servers + '"'
        turn_servers = window.JSON.parse(turn_servers);
      }
      var use_preloaded_route = $("#advanced-settings-form input[name$='use_preloaded_route']").is(':checked');
      var connection_recovery_min_interval = window.parseInt($("#advanced-settings-form input[name$='connection_recovery_min_interval']").val());
      var connection_recovery_max_interval = window.parseInt($("#advanced-settings-form input[name$='connection_recovery_max_interval']").val());
      var hack_via_tcp = $("#advanced-settings-form input[name$='hack_via_tcp']").is(':checked');
      var hack_ip_in_contact = $("#advanced-settings-form input[name$='hack_ip_in_contact']").is(':checked');

      configuration  = {
        uri: sip_uri,
        password:  sip_password,
        ws_servers:  ws_servers,
        display_name: display_name,
        authorization_user: authorization_user,
        register: register,
        register_expires: register_expires,
        registrar_server: registrar_server,
        no_answer_timeout: no_answer_timeout,
        trace_sip: trace_sip,
        stun_servers: stun_servers,
        turn_servers: turn_servers,
        use_preloaded_route: use_preloaded_route,
        connection_recovery_min_interval: connection_recovery_min_interval,
        connection_recovery_max_interval: connection_recovery_max_interval,
        hack_via_tcp: hack_via_tcp,
        hack_ip_in_contact: hack_ip_in_contact
      };
    }

    try {
      MyPhone = new JsSIP.UA(configuration);
    } catch(e) {
      console.log(e.toString());
      Y_U_NO(e.message, 4000);
      return;
    }

    $("#phone > .status .user").text(sip_uri);
    phone_dialed_number_screen.focus();
    div_webcam.show();

    // Transport connection/disconnection callbacks
    MyPhone.on('connected', function(e) {
      document.title = PageTitle;
      GUI.setStatus("connected");
      // Habilitar el phone.
      $("#phone .controls .ws-disconnected").hide();

      ws_was_connected = true;
    });

    MyPhone.on('disconnected', function(e) {
      document.title = PageTitle;
      GUI.setStatus("disconnected");
      // Deshabilitar el phone.
      $("#phone .controls .ws-disconnected").show();
      // Eliminar todas las sessiones existentes.
      $("#sessions > .session").each(function(i, session) {
        GUI.removeSession(session, 500);
      });

      if (! ws_was_connected) {
        alert("WS connection error:\n\n- WS close code: " + e.data.code + "\n- WS close reason: " + e.data.reason);
        if (! window.CustomJsSIPSettings) { window.location.reload(false); }
      }
    });

    register_checkbox.change(function(event) {
      if ($(this).is(":checked")) {
        console.warn("register_checkbox has been checked");
        // Don't change current status for now. Registration callbacks will do it.
        register_checkbox.attr("checked", false);
        // Avoid new change until the registration action ends.
        register_checkbox.attr("disabled", true);
        MyPhone.register();
      }
      else {
        console.warn("register_checkbox has been unchecked");
        // Don't change current status for now. Registration callbacks will do it.
        register_checkbox.attr("checked", true);
        // Avoid new change until the registration action ends.
        register_checkbox.attr("disabled", true);
        MyPhone.unregister();
      }
    });

    // NOTE: Para hacer unregister_all (esquina arriba-dcha un cuadro
    // transparente de 20 x 20 px).
    $("#unregister_all").click(function() {
      MyPhone.unregister({'all': true});
    });

    // NOTE: Para desconectarse/conectarse al WebSocket.
    $("#ws_reconnect").click(function() {
      if (MyPhone.transport.connected)
        MyPhone.transport.disconnect();
      else
        MyPhone.transport.connect();
    });

    phone_call_button.click(function(event) {
      GUI.phoneCallButtonPressed();
    });

    phone_chat_button.click(function(event) {
      GUI.phoneChatButtonPressed();
    });

    phone_dialpad_button.click(function() {
      if ($(this).hasClass("digit-asterisk"))
        sound_file = "asterisk";
      else if ($(this).hasClass("digit-pound"))
        sound_file = "pound";
      else
        sound_file = $(this).text();
      soundPlayer.setAttribute("src", "sounds/dialpad/" + sound_file + ".ogg");
      soundPlayer.play();

      phone_dialed_number_screen.val(phone_dialed_number_screen.val() + $(this).text());
    });

    phone_dialed_number_screen.keypress(function(e) {
       // Enter pressed? so Dial.
      if (e.which == 13)
        GUI.phoneCallButtonPressed();
    });

    // Call/Message reception callbacks
    MyPhone.on('newRTCSession', function(e) {
      GUI.new_session(e)
    });

    MyPhone.on('newMessage', function(e) {
      GUI.new_message(e)
    });

    // Registration/Deregistration callbacks
    MyPhone.on('registered', function(e){
      console.info('Registered');
      GUI.setStatus("registered");

      if (invitedBy) {
        phone_dialed_number_screen.val(invitedBy);
        phone_call_button.click();
        var invited_session = GUI.getSession("sip:" + invitedBy + "@" + tryit_sip_domain);
        invitedBy = null;

        $(invited_session).find(".chat > input[type='text']").val("Hi there, you have invited me to call you :)");
        var e = jQuery.Event("keydown");
        e.which = 13  // Enter
        $(invited_session).find(".chat > input[type='text']").trigger(e);
        $(invited_session).find(".chat > input[type='text']").focus();
      }
    });

    MyPhone.on('unregistered', function(e){
      console.info('Deregistered');
      GUI.setStatus("connected");
    });

    MyPhone.on('registrationFailed', function(e) {
      console.info('Registration failure');
      GUI.setStatus("connected");

      if (! e.data.response) {
        alert("SIP registration error:\n" + e.data.cause);
      }
      else {
        alert("SIP registration error:\n" + e.data.response.status_code.toString() + " " + e.data.response.reason_phrase)
      }
      if (! window.CustomJsSIPSettings) { window.location.reload(false); }
    });

    // Start
    MyPhone.start();

    // Remove login page.
    $("#login-full-background").fadeOut(1000, function() {
      $(".balloonTip").css("display", "none");
      $(this).remove();
    });
    $("#login-box").fadeOut(1000, function() {
      $(this).remove();
    });
    
    // Apply custom settings.
    if (window.Settings) {
      if (window.Settings.videoDisabledByDefault) {
        $('#enableVideo').prop('checked', false);
      }
    }


    // Invitation text and balloon for tryit.jssip.net accounts.

    if (MyPhone.configuration.uri.host === tryit_sip_domain) {
      $("#call-invitation").show();
      $("#call-invitation").click(function() { return false; });

      var invitation_link = invitation_link_pre + MyPhone.configuration.uri.user;

      $("#call-invitation > a").balloon({
        position: "bottom",
        contents: "<p>copy and give the following link to others (via e-mail, chat, fax):</p><a href='" + invitation_link + "' target='_blank'>" + invitation_link + "</a>",
        classname: "balloonInvitationTip",
        css: {
          border: 'solid 1px #000',
          padding: '4px 10px',
          fontSize: '150%',
          fontWeight: 'bold',
          textAlign: 'center',
          lineHeight: '2',
          backgroundColor: '#FFF',
          color: '#444'
        }
      });
    }


    // Theme selectors.

    theme01.click(function(event) {
      $("body").removeClass();
      $("body").addClass("bg01");
    });

    theme02.click(function(event) {
      $("body").removeClass();
      $("body").addClass("bg02");
    });

    theme03.click(function(event) {
      $("body").removeClass();
      $("body").addClass("bg03");
    });

    theme04.click(function(event) {
      $("body").removeClass();
      $("body").addClass("bg04");
    });


    // Piwik stuff

    try {
      var piwikTracker = Piwik.getTracker("http://www.aliax.net/piwik/piwik.php", 6);
      var piwikData = sip_uri + " | " + ws_servers;
      piwikTracker.setCustomVariable(3, "data", piwikData, "page");
      piwikTracker.trackPageView();
      piwikTracker.enableLinkTracking();
    } catch( err ) {}
  }

});
