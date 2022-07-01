Game.KillMutex = [
    "hl2_singleton_mutex",

];
Game.DirSymlinkExclusions = [
    "bin",
"Game\\cfg"

];
Game.FileSymlinkExclusions = [
        "joystick.cfg",
         "autoexec.cfg",
         "steam_appid.txt",
         "xinput9_1_0.dll",
         "xinput1_3.dll",
];
Game.HandlerInterval = 100;
Game.SymlinkExe = false;
Game.SymlinkGame = true;
Game.ExecutableName = "hl2.exe";
Game.SteamID = "4000";
Game.GUID = "Game Folder Name";
Game.GameName = "Game Name";
Game.NeedsSteamEmulation = false;
Game.UseGoldberg = true;
Game.LauncherTitle = "";
Game.SaveType = Nucleus.SaveType.CFG;
Game.WorkingFolder = "bin";
Game.SupportsPositioning = true;
Game.MaxPlayersOneMonitor = 16;
Game.MaxPlayers = 128;
Game.Hook.ForceFocus = false;
Game.Hook.ForceFocusWindowName = "Window Name";
Game.Hook.DInputEnabled = false;
Game.Hook.DInputForceDisable = true;
Game.Hook.XInputEnabled = true;
Game.Hook.XInputReroute = false;
Game.Hook.UseAlpha8CustomDll = true;
Game.FakeFocus= true;
Game.HookFocus= true;
Game.PauseBetweenStarts = 30;
Game.Description = "";
Game.DPIHandling = Nucleus.DPIHandling.InvScaled;

Game.Play = function () {

  var Args = Context.Args = " -windowed -AlwaysFocus " + " -w " + (Context.Width) + " -h " + (Context.Height);

    Context.StartArguments = Args;

    var autoExec = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\game\\cfg\\autoexec.cfg";
    var lines = [
        "engine_no_focus_sleep 0" // unlimited FPS on all screens
    ];

    if (Player.IsKeyboardPlayer) {
        lines.push("joystick 0");
        lines.push("exec undo360controller.cfg");
    }
    else {
        lines.push("exec 360controller.cfg");
    }

    Context.WriteTextFile(autoExec, lines);

};