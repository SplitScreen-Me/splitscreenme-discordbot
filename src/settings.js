import devSettings from '../settings-development';

const Settings = {
  private: { ...devSettings.private },
  public: { ...devSettings.public },
};

// r-mach : If production mode, replace private with the env var BOT_PRIVATE.
if (process.env.NODE_ENV === 'production') {
  if (process.env.BOT_PRIVATE) {
    Settings.private = { ...JSON.parse(process.env.BOT_PRIVATE) };
  } else {
    console.log(
      '[Warning] Running in production mode without the BOT_PRIVATE environment set!',
    );
  }
}

export default Settings;
