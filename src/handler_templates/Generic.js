Game.FileSymlinkExclusions = [
  "steam_api.dll",
    "steam_appid.txt",
    "config.ini",
];
Game.NeedsSteamEmulation = false;
Game.UseGoldberg = true;
Game.HandlerInterval = 100;
Game.SymlinkExe = false;
Game.SymlinkGame = true;
Game.SupportsKeyboard = true;
Game.ExecutableName = "game.exe";
Game.SteamID = "00000";
Game.GUID = "Game Name";
Game.GameName = "Game Folder Name";
Game.MaxPlayers = 4;
Game.MaxPlayersOneMonitor = 4;
Game.LauncherTitle = "";
Game.HideTaskbar = false;
Game.Hook.ForceFocus = true;
Game.Hook.ForceFocusWindowName = "Window Name";
Game.Hook.DInputEnabled = false;
Game.Hook.DInputForceDisable = false;
Game.Hook.XInputEnabled = true;
Game.Hook.XInputReroute = false;
Game.Hook.CustomDllEnabled= false;
Game.XInputPlusDll = [ "xinput1_3.dll" ];
Game.FakeFocus= true;
Game.Description = "";
Game.PauseBetweenStarts = 20;

Game.Play = function () {

	var savePath = Context.SavePath = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\config.ini";
	var savePkgOrigin = System.IO.Path.Combine(Context.RootInstallFolder, "config.ini");
	System.IO.File.Copy(savePkgOrigin, savePath, true);

   var savePath = Context.SavePath = Context.GetFolder(Nucleus.Folder.InstancedGameFolder) + "\\config.ini";
    Context.ModifySaveFile(savePath, savePath, Nucleus.SaveType.INI, [
       new Nucleus.IniSaveInfo("", "ResolutionWidth", Context.Width),
       new Nucleus.IniSaveInfo("", "ResolutionHeight", Context.Height),
       new Nucleus.IniSaveInfo("", "Fullscreen", false),
    ]);



}