Game.FileSymlinkExclusions = [
	"steam_api.dll",
	 "steam_appid.txt",
        "steam_interfaces.txt",
       "XInput1_3.dll",
];
Game.KillMutex = [
    "sBioMain",
];
Game.NeedsSteamEmulation = false;
Game.UseGoldberg = true;
Game.GoldbergNoLocalSave = true;
Game.UseNucleusEnvironment = true;
Game.HandlerInterval = 100;
Game.SymlinkExe = false;
Game.SymlinkGame = true;
Game.SymlinkFolders = true;
Game.SupportsKeyboard = false;
Game.ExecutableName = "game.exe";
Game.SteamID = "0000";
Game.GUID = "Game Folder Name";
Game.GameName = "Game Name";
Game.MaxPlayers = 4;
Game.MaxPlayersOneMonitor = 4;
Game.BinariesFolder = "";
Game.LauncherTitle = "";
Game.HideTaskbar = false;
Game.Hook.ForceFocus = true;
Game.Hook.ForceFocusWindowName = "Window Name";
Game.Hook.DInputEnabled = false;
Game.Hook.DInputForceDisable = true;
Game.Hook.XInputEnabled = true;
Game.Hook.XInputReroute = false;
Game.XInputPlusDll = [ "xinput1_3.dll" ];
Game.Hook.CustomDllEnabled= false;
Game.PreventWindowDeactivation =  true;
Game.HookFocus = true;
Game.Description = "";
Game.PauseBetweenStarts = 25;

Game.Play = function () {

        var VideoConfig = Context.EnvironmentPlayer + Context.UserProfileConfigPath + "\\config.ini";
        Context.ModifySaveFile(VideoConfig, VideoConfig, Nucleus.SaveType.INI, [
        new Nucleus.IniSaveInfo("DISPLAY", "FullScreen", "OFF"),
        new Nucleus.IniSaveInfo("Window", "MainX", Context.Width),
        new Nucleus.IniSaveInfo("Window", "MainY", Context.Height),
        new Nucleus.IniSaveInfo("DISPLAY", "AdjustAspect", "ON"),
        new Nucleus.IniSaveInfo("DISPLAY", "resolution", Context.Width + "x" + Context.Height),
    ]);

        var autoExec = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\steam_interfaces.txt";
        var lines = [
        "SteamClient015",
        "SteamGameServer012",
        "SteamGameServerStats001",
        "SteamUser017",
        "SteamFriends014",
        "SteamUtils007",
        "SteamMatchMaking009",
        "SteamMatchMakingServers002",
        "STEAMUSERSTATS_INTERFACE_VERSION011",
        "STEAMAPPS_INTERFACE_VERSION006",
        "SteamNetworking005",
        "STEAMREMOTESTORAGE_INTERFACE_VERSION012",
        "STEAMSCREENSHOTS_INTERFACE_VERSION002",
        "STEAMHTTP_INTERFACE_VERSION002",
        "STEAMUNIFIEDMESSAGES_INTERFACE_VERSION001",
        "STEAMUGC_INTERFACE_VERSION002",
        "STEAMAPPLIST_INTERFACE_VERSION001",
        "STEAMMUSIC_INTERFACE_VERSION001",
        "STEAMMUSICREMOTE_INTERFACE_VERSION001",
        "STEAMCONTROLLER_INTERFACE_VERSION",
        ];

        Context.WriteTextFile(autoExec, lines);
}