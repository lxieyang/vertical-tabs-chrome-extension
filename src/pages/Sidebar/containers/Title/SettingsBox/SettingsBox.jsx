import React, { useContext } from 'react';
import DarkModeContext from '../../../context/dark-mode-context';
import { MdSettings, MdBrightnessAuto } from 'react-icons/md';
import { TiDownload } from 'react-icons/ti';
import {
  FaAlignJustify,
  FaAlignRight,
  FaAlignLeft,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import { IoIosBarcode, IoIosMoon, IoIosSunny } from 'react-icons/io';
import { WiMoonAltNew, WiMoonAltWaxingCrescent3 } from 'react-icons/wi';

import './SettingsBox.css';

const SettingsBox = ({
  settingSidebarLocation,
  setSettingSidebarLocation,
  settingSidebarShouldShrinkBody,
  setSettingSidebarShouldShrinkBody,
  settingDisplayTabTitleInFull,
  setSettingDisplayTabTitleInFull,
  settingDarkMode,
  setSettingDarkMode,
}) => {
  const darkModeContext = useContext(DarkModeContext);

  const { isDark } = darkModeContext;

  const divider = (
    <div
      className={['SettingEntryDivider', isDark ? 'Dark' : null].join(' ')}
    ></div>
  );

  return (
    <div className={['PopoverContainer', isDark ? 'Dark' : null].join(' ')}>
      <div className={['PopoverTitle', isDark ? 'Dark' : null].join(' ')}>
        <MdSettings style={{ marginRight: 6 }} /> Settings
      </div>
      <div className={['PopoverContent', isDark ? 'Dark' : null].join(' ')}>
        {/* SIDEBAR POSITION */}
        <div className="SettingEntryContainer">
          <div className="SettingEntryTitle">
            <FaAlignJustify className="SettingEntryTitleIcon" />
            Sidebar position:
          </div>
          <form className="SettingEntryContent">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label
                className={[
                  settingSidebarLocation === 'left' ? 'Active' : null,
                  isDark ? 'Dark' : null,
                ].join(' ')}
              >
                <input
                  type="radio"
                  checked={settingSidebarLocation === 'left'}
                  onChange={() => setSettingSidebarLocation('left')}
                  name="radio"
                />
                <FaAlignLeft className="SettingEntryOptionIcon" />
                Left
              </label>
              <label
                className={[
                  settingSidebarLocation !== 'left' ? 'Active' : null,
                  isDark ? 'Dark' : null,
                ].join(' ')}
              >
                <input
                  type="radio"
                  checked={settingSidebarLocation !== 'left'}
                  onChange={() => setSettingSidebarLocation('right')}
                  name="radio"
                />
                <FaAlignRight className="SettingEntryOptionIcon" />
                Right
              </label>
            </div>
          </form>
        </div>

        {divider}
        {/* SQUEEZE WEB PAGE WHEN SIDEBAR OPENS */}
        <div className="SettingEntryContainer">
          <div className="SettingEntryTitle">
            <TiDownload
              className="SettingEntryTitleIcon"
              style={{
                transform: 'rotate(-90deg)',
              }}
            />
            Squeeze webpage when the sidebar opens:
          </div>
          <form className="SettingEntryContent">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label
                className={[
                  settingSidebarShouldShrinkBody ? 'Active' : null,
                  isDark ? 'Dark' : null,
                ].join(' ')}
              >
                <input
                  type="radio"
                  checked={settingSidebarShouldShrinkBody}
                  onChange={() => setSettingSidebarShouldShrinkBody(true)}
                  name="radio"
                />
                <FaCheck className="SettingEntryOptionIcon" />
                Yes
              </label>
              <label
                className={[
                  !settingSidebarShouldShrinkBody ? 'Active' : null,
                  isDark ? 'Dark' : null,
                ].join(' ')}
              >
                <input
                  type="radio"
                  checked={!settingSidebarShouldShrinkBody}
                  onChange={() => setSettingSidebarShouldShrinkBody(false)}
                  name="radio"
                />
                <FaTimes className="SettingEntryOptionIcon" />
                No
              </label>
            </div>
          </form>
        </div>

        {divider}
        {/* DISPLAY TAB TITLE IN FULL */}
        <div className="SettingEntryContainer">
          <div className="SettingEntryTitle">
            <IoIosBarcode className="SettingEntryTitleIcon" />
            Display tab title:
          </div>
          <form className="SettingEntryContent">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label
                className={[
                  settingDisplayTabTitleInFull ? 'Active' : null,
                  isDark ? 'Dark' : null,
                ].join(' ')}
              >
                <input
                  type="radio"
                  checked={settingDisplayTabTitleInFull}
                  onChange={() => setSettingDisplayTabTitleInFull(true)}
                  name="radio"
                />
                <WiMoonAltNew className="SettingEntryOptionIcon" />
                Full
              </label>
              <label
                className={[
                  !settingDisplayTabTitleInFull ? 'Active' : null,
                  isDark ? 'Dark' : null,
                ].join(' ')}
              >
                <input
                  type="radio"
                  checked={!settingDisplayTabTitleInFull}
                  onChange={() => setSettingDisplayTabTitleInFull(false)}
                  name="radio"
                />
                <WiMoonAltWaxingCrescent3 className="SettingEntryOptionIcon" />
                Truncated
              </label>
            </div>
          </form>
        </div>

        {divider}
        {/* DARK THEME */}
        <div className="SettingEntryContainer">
          <div className="SettingEntryTitle">
            <IoIosMoon className="SettingEntryTitleIcon" />
            Dark theme:
          </div>
          <form className="SettingEntryContent">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label
                className={[
                  settingDarkMode === 'auto' ? 'Active' : null,
                  isDark ? 'Dark' : null,
                ].join(' ')}
              >
                <input
                  type="radio"
                  checked={settingDarkMode === 'auto'}
                  onChange={() => setSettingDarkMode('auto')}
                  name="radio"
                />
                <MdBrightnessAuto className="SettingEntryOptionIcon" />
                Auto
              </label>
              <label
                className={[
                  settingDarkMode === 'light' ? 'Active' : null,
                  isDark ? 'Dark' : null,
                ].join(' ')}
              >
                <input
                  type="radio"
                  checked={settingDarkMode === 'light'}
                  onChange={() => setSettingDarkMode('light')}
                  name="radio"
                />
                <IoIosSunny className="SettingEntryOptionIcon" />
                Light
              </label>
              <label
                className={[
                  settingDarkMode === 'dark' ? 'Active' : null,
                  isDark ? 'Dark' : null,
                ].join(' ')}
              >
                <input
                  type="radio"
                  checked={settingDarkMode === 'dark'}
                  onChange={() => setSettingDarkMode('dark')}
                  name="radio"
                />
                <IoIosMoon className="SettingEntryOptionIcon" />
                Dark
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsBox;
