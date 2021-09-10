Game.DirSymlinkExclusions = [
    "Engine\\Binaries\\ThirdParty\\Steamworks\\Steamv139\\Win64",
     "Game\\Binaries\\Win64",
];
Game.FileSymlinkExclusions = [
    "steam_api64.dll",
	"steam_appid.txt",
	"XInput1_3.dll",
];
Game.GameName = "Game Name";
Game.HandlerInterval = 100;
Game.SymlinkExe = false;
Game.SymlinkGame = true;
Game.SupportsKeyboard = true;
Game.ExecutableName = "Game-win64-shipping.exe";
Game.SteamID = "00000";
Game.GUID = "Game Folder Name";
Game.MaxPlayers = 4;
Game.MaxPlayersOneMonitor = 4;
Game.BinariesFolder = "Game\\Binaries\\Win64";
Game.NeedsSteamEmulation = false;
Game.UseGoldberg = true;
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
Game.SetWindowHook = true;
Game.PauseBetweenStarts = 30;

Game.Play = function () {

    var Args = Context.Args = " -windowed " + " -AlwaysFocus " + " -nosplash " + " -steam " + " -ResX= " + (Context.Width) + " -ResY= " + (Context.Height);

    Context.StartArguments = Args;

};