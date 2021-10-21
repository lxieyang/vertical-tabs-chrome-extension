import React, { useContext } from 'react';
import classNames from 'classnames';
import DarkModeContext from '../../../context/dark-mode-context';
import { MdBrightnessAuto } from 'react-icons/md';
import { VscPreview } from 'react-icons/vsc';
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

const Option = ({ checkedValue, onChangeHandler, Icon, children }) => {
  const darkModeContext = useContext(DarkModeContext);
  const { isDark } = darkModeContext;

  return (
    <label
      className={classNames({
        Active: checkedValue,
        Dark: isDark,
      })}
    >
      <input
        type="radio"
        checked={checkedValue}
        onChange={onChangeHandler}
        name="radio"
      />
      <Icon className="SettingEntryOptionIcon" />
      {children}
    </label>
  );
};

const SettingsBox = ({
  settingSidebarLocation,
  setSettingSidebarLocation,
  settingSidebarShouldShrinkBody,
  setSettingSidebarShouldShrinkBody,
  settingDisplayTabTitleInFull,
  setSettingDisplayTabTitleInFull,
  settingDisplayTabPreviewFrame,
  setSettingDisplayTabPreviewFrame,
  settingAutoShowHide,
  setSettingAutoShowHide,
  settingAutoShowHideDelay,
  setSettingAutoShowHideDelay,
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
            <Option
              checkedValue={settingSidebarLocation === 'left'}
              onChangeHandler={() => setSettingSidebarLocation('left')}
              Icon={FaAlignLeft}
            >
              Left
            </Option>
            <Option
              checkedValue={settingSidebarLocation !== 'left'}
              onChangeHandler={() => setSettingSidebarLocation('right')}
              Icon={FaAlignRight}
            >
              Right
            </Option>
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
            <Option
              checkedValue={settingSidebarShouldShrinkBody}
              onChangeHandler={() => setSettingSidebarShouldShrinkBody(true)}
              Icon={FaCheck}
            >
              Yes
            </Option>
            <Option
              checkedValue={!settingSidebarShouldShrinkBody}
              onChangeHandler={() => setSettingSidebarShouldShrinkBody(false)}
              Icon={FaTimes}
            >
              No
            </Option>
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
            <Option
              checkedValue={settingDisplayTabTitleInFull}
              onChangeHandler={() => setSettingDisplayTabTitleInFull(true)}
              Icon={WiMoonAltNew}
            >
              Full
            </Option>
            <Option
              checkedValue={!settingDisplayTabTitleInFull}
              onChangeHandler={() => setSettingDisplayTabTitleInFull(false)}
              Icon={WiMoonAltWaxingCrescent3}
            >
              Truncated
            </Option>
          </form>
        </div>

        {divider}
        {/* DISPLAY TAB PREVIEW FRAME */}
        <div className="SettingEntryContainer">
          <div className="SettingEntryTitle">
            <VscPreview className="SettingEntryTitleIcon" />
            Display tab preview box:
          </div>
          <form className="SettingEntryContent">
            <Option
              checkedValue={settingDisplayTabPreviewFrame}
              onChangeHandler={() => setSettingDisplayTabPreviewFrame(true)}
              Icon={FaCheck}
            >
              Yes
            </Option>
            <Option
              checkedValue={!settingDisplayTabPreviewFrame}
              onChangeHandler={() => setSettingDisplayTabPreviewFrame(false)}
              Icon={FaTimes}
            >
              No
            </Option>
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
            <Option
              checkedValue={settingAutoShowHide}
              onChangeHandler={() => setSettingAutoShowHide(true)}
              Icon={FaCheck}
            >
              Yes{' '}
              <div className="AdditionalSettingItemContainer">
                (hide in
                <input
                  disabled={!settingAutoShowHide}
                  type="number"
                  min="0"
                  className="MillSecondsInput"
                  placeholder={500}
                  value={settingAutoShowHideDelay}
                  onChange={(e) => {
                    setSettingAutoShowHideDelay(e.target.value);
                  }}
                />{' '}
                ms)
              </div>
            </Option>
            <Option
              checkedValue={!settingAutoShowHide}
              onChangeHandler={() => setSettingAutoShowHide(false)}
              Icon={FaTimes}
            >
              No
            </Option>
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
            <Option
              checkedValue={settingDarkMode === 'auto'}
              onChangeHandler={() => setSettingDarkMode('auto')}
              Icon={MdBrightnessAuto}
            >
              Auto
            </Option>
            <Option
              checkedValue={settingDarkMode === 'light'}
              onChangeHandler={() => setSettingDarkMode('light')}
              Icon={IoIosSunny}
            >
              Light
            </Option>
            <Option
              checkedValue={settingDarkMode === 'dark'}
              onChangeHandler={() => setSettingDarkMode('dark')}
              Icon={IoIosMoon}
            >
              Dark
            </Option>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsBox;
