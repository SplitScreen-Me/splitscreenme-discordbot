Game.DirSymlinkExclusions = [
    "Bin64",
];
Game.FileSymlinkExclusions = [
    "steam_api64.dll",
	"steam_appid.txt",
	"XInput1_3.dll",
	"steam_interfaces.txt",
];
Game.FileSymlinkCopyInstead = [
        "system.cfg",
];
Game.KillMutex = [
    "CrytekApplication(0)",
];
Game.GameName = "Game Name";
Game.UseGoldberg = true;
Game.HandlerInterval = 100;
Game.SymlinkExe = false;
Game.SymlinkGame = true;
Game.SupportsKeyboard = false;
Game.ExecutableName = "game.exe";
Game.SteamID = "00000";
Game.GUID = "Game Folder Name";
Game.MaxPlayers = 2;
Game.MaxPlayersOneMonitor = 4;
Game.BinariesFolder = "Bin64";
Game.LauncherTitle = "";
Game.SupportsPositioning = true;
Game.ForceFinishOnPlay = true;
Game.Hook.ForceFocus = true;
Game.Hook.ForceFocusWindowName = "Window Name";
Game.Hook.DInputEnabled = false;
Game.Hook.XInputEnabled = true;
Game.Hook.XInputReroute = false;
Game.Hook.CustomDllEnabled= false;
Game.XInputPlusDll = [ "xinput1_3.dll" ];
Game.HookFocus= true;
Game.FakeFocus= true;
Game.PauseBetweenStarts = 30;
Game.Description = "";


Game.Play = function () {

        var savePath = Context.SavePath = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\system.cfg";
    Context.ModifySaveFile(savePath, savePath, Nucleus.SaveType.INI, [
            new Nucleus.IniSaveInfo("", "r_width", Context.Width),
            new Nucleus.IniSaveInfo("", "r_height", Context.Height),
            new Nucleus.IniSaveInfo("", "r_Fullscreen", "0"),
            new Nucleus.IniSaveInfo("", "r_FullscreenWindow", "0"),

        ]);

        var autoExec = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\Bin64\\steam_interfaces.txt";
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

};