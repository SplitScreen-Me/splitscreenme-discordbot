Game.DirSymlinkExclusions = [
    "Game_Data\\Plugins",
];
Game.FileSymlinkExclusions = [
    "steam_api.dll",
    "steam_appid.txt",
];
Game.GameName = "Game Name";
Game.HandlerInterval = 100;
Game.SymlinkExe = false;
Game.SymlinkGame = true;
Game.SupportsKeyboard = true;
Game.ExecutableName = "game.exe";
Game.SteamID = "0000";
Game.GUID = "Game Folder Name";
Game.MaxPlayers = 4;
Game.MaxPlayersOneMonitor = 4;
Game.BinariesFolder = "";
Game.NeedsSteamEmulation = false;
Game.UseGoldberg = true;
Game.LauncherTitle = "";
Game.Hook.ForceFocus = true;
Game.Hook.ForceFocusWindowName = "Window Name";
Game.Hook.DInputEnabled = false;
Game.Hook.DInputForceDisable = true;
Game.Hook.XInputEnabled = true;
Game.Hook.XInputReroute = false;
Game.XInputPlusDll = [ "xinput1_4.dll" ];
Game.Hook.CustomDllEnabled = false;
Game.SetWindowHookStart = true;
Game.BlockRawInput = true;
Game.Description = "";
Game.PauseBetweenStarts = 30;

Game.Play = function () {

       Context.EditRegKey("HKEY_CURRENT_USER", "SOFTWARE\\PATH\\TOREGISTRY", "Fullscreen_h2248877754", 0, Nucleus.RegType.DWord);

       Context.EditRegKey("HKEY_CURRENT_USER", "SOFTWARE\\PATH\\TOREGISTRY", "Screenmanager Fullscreen mode_h3630240806", 3, Nucleus.RegType.DWord);

       Context.EditRegKey("HKEY_CURRENT_USER", "SOFTWARE\\PATH\\TOREGISTRY", "Screenmanager Resolution Height_h2627697771", Context.Height, Nucleus.RegType.DWord);

       Context.EditRegKey("HKEY_CURRENT_USER", "SOFTWARE\\PATH\\TOREGISTRY", "Screenmanager Resolution Width_h182942802", Context.Width, Nucleus.RegType.DWord);

       Context.EditRegKey("HKEY_CURRENT_USER", "SOFTWARE\\PATH\\TOREGISTRY", "Screenmanager Resolution Use Native_h1405027254", 0, Nucleus.RegType.DWord);

       Context.EditRegKey("HKEY_CURRENT_USER", "SOFTWARE\\PATH\\TOREGISTRY", "currentresolutuion_h2338577015", Context.Width + "x" + Context.Height, Nucleus.RegType.Binary);

}