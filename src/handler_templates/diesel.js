Game.KillMutex = [
    "Name Engine Game",
];
Game.FileSymlinkExclusions = [
     "steam_api.dll",
	"steam_appid.txt",
      "xinput1_3.dll",
];
Game.KillMutexType = "Event";
Game.NeedsSteamEmulation = false;
Game.UseGoldberg = true;
Game.UseSteamStubDRMPatcher = false;
Game.HandlerInterval = 100;
Game.SymlinkExe = false;
Game.SymlinkGame = true;
Game.SymlinkFolders = true;
Game.SupportsKeyboard = false;
Game.ExecutableName = "game_win32_release.exe";
Game.SteamID = "0000";
Game.GUID = "Game Name";
Game.GameName = "Game Folder Name";
Game.MaxPlayers = 4;
Game.MaxPlayersOneMonitor = 4;
Game.LauncherTitle = "";
Game.StartArguments = "";
Game.HideTaskbar = false;
Game.Hook.ForceFocus = true;
Game.Hook.ForceFocusWindowName = "Window Name";
Game.Hook.DInputEnabled = false;
Game.Hook.DInputForceDisable = true;
Game.Hook.XInputEnabled = true;
Game.Hook.XInputReroute = false;
Game.Hook.UseAlpha8CustomDll = true;
Game.PauseBetweenStarts = 30;

Game.Play = function () {

    var path = "%USERPROFILE%\\AppData\\Local\\GAME\\renderer_settings.xml";
    Context.ChangeXmlAttributeValue(path, "//d3d_device", "resolution", Context.Width + " " + Context.Height);
    Context.ChangeXmlAttributeValue(path, "//d3d_device", "windowed", "true");
    Context.ChangeXmlAttributeValue(path, "//d3d_device", "aspect_ratio", Context.AspectRatioDecimal);


        var autoExec = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\steam_interfaces.txt";
        var lines = [
        "SteamClient009",
        "SteamGameServer010",
        "SteamGameServerStats001",
        "SteamUser013",
        "SteamFriends005",
        "SteamUtils005",
        "SteamMatchMaking008",
        "SteamMatchMakingServers002",
        "STEAMUSERSTATS_INTERFACE_VERSION007",
        "STEAMAPPS_INTERFACE_VERSION003",
        "SteamNetworking003",
        "STEAMREMOTESTORAGE_INTERFACE_VERSION002",
        "SteamMasterServerUpdater001",
        ];

        Context.WriteTextFile(autoExec, lines);

}