import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery'
import Wrapper from './Wrapper';

var setSidebarSize = () => {
    window.innerWidth < 1250
        ? $(".app-container").addClass("closed-sidebar-mobile closed-sidebar")
        : $(".app-container").removeClass("closed-sidebar-mobile closed-sidebar");
};

$(() => {
    setSidebarSize();
    ReactDOM.render(
        <Wrapper />,
        document.getElementsByClassName('app-container')[0]
    );
    $("body").tooltip({
        selector: '[data-toggle="tooltip"]'
    });
    $(".mobile-toggle-nav").click(function() {
        $(this).toggleClass("is-active"), $(".app-container").toggleClass("sidebar-mobile-open");
    });
    $(".mobile-toggle-header-nav").click(function() {
        $(this).toggleClass("active"), $(".app-header__content").toggleClass("header-mobile-open");
    });
    $(window).on("resize", function() {
        setSidebarSize();
    });
    $(".btn-open-options").click(function() {
        $(".ui-theme-settings").toggleClass("settings-open")
    });
    $(".close-sidebar-btn").click(function() {
        var t = $(this).attr("data-class");
        $(".app-container").toggleClass(t);
        var n = $(this);
        n.hasClass("is-active") ? n.removeClass("is-active") : n.addClass("is-active");
    });
    $(".switch-container-class").on("click", function() {
        var t = $(this).attr("data-class");
        $(".app-container").toggleClass(t), $(this).parent().find(".switch-container-class").removeClass("active"), $(this).addClass("active");
    });
    $(".switch-theme-class").on("click", function() {
        var t = $(this).attr("data-class");
        "body-tabs-line" == t && ($(".app-container").removeClass("body-tabs-shadow"), $(".app-container").addClass(t)), "body-tabs-shadow" == t && ($(".app-container").removeClass("body-tabs-line"), $(".app-container").addClass(t)), $(this).parent().find(".switch-theme-class").removeClass("active"), $(this).addClass("active");
    });
    $(".switch-header-cs-class").on("click", function() {
        var t = $(this).attr("data-class");
        $(".switch-header-cs-class").removeClass("active"), $(this).addClass("active"), $(".app-header").attr("class", "app-header"), $(".app-header").addClass("header-shadow " + t);
    });
    $(".switch-sidebar-cs-class").on("click", function() {
        var t = $(this).attr("data-class");
        $(".switch-sidebar-cs-class").removeClass("active"), $(this).addClass("active"), $(".app-sidebar").attr("class", "app-sidebar"), $(".app-sidebar").addClass("sidebar-shadow " + t);
    });
});
