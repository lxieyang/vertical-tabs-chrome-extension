import React, { useContext } from 'react';
import DarkModeContext from '../../../context/dark-mode-context';
import { MdSettings } from 'react-icons/md';
import { TiDownload } from 'react-icons/ti';
import {
  FaAlignJustify,
  FaAlignRight,
  FaAlignLeft,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import { IoIosBarcode } from 'react-icons/io';
import { WiMoonAltNew, WiMoonAltWaxingCrescent3 } from 'react-icons/wi';

import './SettingsBox.css';

const SettingsBox = ({
  settingSidebarLocation,
  setSettingSidebarLocation,
  settingSidebarShouldShrinkBody,
  setSettingSidebarShouldShrinkBody,
  settingDisplayTabTitleInFull,
  setSettingDisplayTabTitleInFull,
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
      </div>
    </div>
  );
};

export default SettingsBox;
