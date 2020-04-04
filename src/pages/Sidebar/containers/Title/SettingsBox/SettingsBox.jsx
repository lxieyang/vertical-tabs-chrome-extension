import React, { useContext, useState } from 'react';
import classNames from 'classnames';
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
import { MdFontDownload } from 'react-icons/md';

import './SettingsBox.css';

const SettingsBox = ({
  settingSidebarLocation,
  setSettingSidebarLocation,
  settingSidebarShouldShrinkBody,
  setSettingSidebarShouldShrinkBody,
  settingDisplayTabTitleInFull,
  setSettingDisplayTabTitleInFull,
  settingAutoShowHide,
  setSettingAutoShowHide,
  settingDarkMode,
  setSettingDarkMode,
}) => {
  const darkModeContext = useContext(DarkModeContext);

  const { isDark } = darkModeContext;

  const divider = (
    <div
      className={classNames({ SettingEntryDivider: true, Dark: isDark })}
    ></div>
  );

  return (
    <div className={classNames({ PopoverContainer: true, Dark: isDark })}>
      <div className={classNames({ PopoverTitle: true, Dark: isDark })}>
        {/* <MdSettings style={{ marginRight: 6 }} size={'19px'} />  */}
        Settings <div style={{ flex: 1 }}></div>
        <a
          title="Source code"
          className={classNames({ VersionBadge: true, Dark: isDark })}
          href={'https://github.com/lxieyang/vertical-tabs-chrome-extension'}
          target="_blank"
          rel="noopener noreferrer"
        >
          v{chrome.runtime.getManifest().version}
        </a>
      </div>
      <div className={classNames({ PopoverContent: true, Dark: isDark })}>
        {/* SIDEBAR POSITION */}
        <div className="SettingEntryContainer">
          <div className="SettingEntryTitle">
            <FaAlignJustify className="SettingEntryTitleIcon" />
            Sidebar position:
          </div>
          <form className="SettingEntryContent">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label
                className={classNames({
                  Active: settingSidebarLocation === 'left',
                  Dark: isDark,
                })}
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
                className={classNames({
                  Active: settingSidebarLocation !== 'left',
                  Dark: isDark,
                })}
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
                className={classNames({
                  Active: settingSidebarShouldShrinkBody,
                  Dark: isDark,
                })}
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
                className={classNames({
                  Active: !settingSidebarShouldShrinkBody,
                  Dark: isDark,
                })}
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
                className={classNames({
                  Active: settingDisplayTabTitleInFull,
                  Dark: isDark,
                })}
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
                className={classNames({
                  Active: !settingDisplayTabTitleInFull,
                  Dark: isDark,
                })}
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
        {/* AUTO SHOW HIDE SIDEBAR */}
        <div className="SettingEntryContainer">
          <div className="SettingEntryTitle">
            <MdFontDownload className="SettingEntryTitleIcon" />
            Auto show/hide sidebar:
          </div>
          <form className="SettingEntryContent">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label
                className={classNames({
                  Active: settingAutoShowHide,
                  Dark: isDark,
                })}
              >
                <input
                  type="radio"
                  checked={settingAutoShowHide}
                  onChange={() => setSettingAutoShowHide(true)}
                  name="radio"
                />
                <FaCheck className="SettingEntryOptionIcon" />
                Yes
              </label>
              <label
                className={classNames({
                  Active: !settingAutoShowHide,
                  Dark: isDark,
                })}
              >
                <input
                  type="radio"
                  checked={!settingAutoShowHide}
                  onChange={() => setSettingAutoShowHide(false)}
                  name="radio"
                />
                <FaTimes className="SettingEntryOptionIcon" />
                No
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
                className={classNames({
                  Active: settingDarkMode === 'auto',
                  Dark: isDark,
                })}
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
                className={classNames({
                  Active: settingDarkMode === 'light',
                  Dark: isDark,
                })}
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
                className={classNames({
                  Active: settingDarkMode === 'dark',
                  Dark: isDark,
                })}
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
