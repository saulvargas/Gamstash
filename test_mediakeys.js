#!/usr/bin/gjs

const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Webkit = imports.gi.WebKit;
const Gio = imports.gi.Gio;

var conn = Gio.DBus.get_sync(Gio.BusType.SESSION, null);

var proxy = Gio.DBusProxy.new_sync(conn, Gio.DBusProxyFlags.NONE, null, "org.gnome.SettingsDaemon", "/org/gnome/SettingsDaemon/MediaKeys", "org.gnome.SettingsDaemon.MediaKeys", null);

proxy.call_sync("GrabMediaPlayerKeys", new GLib.Variant("(su)", "WebMediaKeys", 0), Gio.DBusCallFlags.NONE, 1, null);

var playing = false;

proxy.connect("g-signal", function(proxy, sender, signal, parameters) {
    if (signal === "MediaPlayerKeyPressed") {
        var action = parameters.unpack()[1].unpack();
        if (action === "Play") {
            if (playing) {
                print("Pause");
            } else {
                print("Play");
            }
            playing = !playing;
        } else {
            print(action);
        }
    }
});


let loop = new GLib.MainLoop(null, false);
loop.run();
