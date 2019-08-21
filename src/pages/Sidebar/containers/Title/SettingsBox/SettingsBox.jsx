import React, { Component } from 'react';
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

class SettingsBox extends Component {
  render() {
    const {
      settingSidebarLocation,
      setSettingSidebarLocation,
      settingSidebarShouldShrinkBody,
      setSettingSidebarShouldShrinkBody,
      settingDisplayTabTitleInFull,
      setSettingDisplayTabTitleInFull,
    } = this.props;

    return (
      <div
        style={{
          backgroundColor: '#fff',
          opacity: 1,
          color: 'rgb(32, 33, 36)',
          border: '1px solid #ebebeb',
          borderRadius: 'calc(0.3rem - 1px)',
          boxShadow:
            '0px 2px 2px -1px rgba(0, 0, 0, 0.2),0px 1px 2px 0px rgba(0, 0, 0, 0.08), 0px 1px 2px 0px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="PopoverTitle">
          <MdSettings style={{ marginRight: 6 }} /> Settings
        </div>
        <div className="PopoverContent">
          <div className="SettingEntryContainer">
            <div className="SettingEntryTitle">
              <FaAlignJustify className="SettingEntryTitleIcon" />
              Sidebar position:
            </div>
            <form className="SettingEntryContent">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label
                  className={
                    settingSidebarLocation === 'left' ? 'Active' : null
                  }
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
                  className={
                    settingSidebarLocation !== 'left' ? 'Active' : null
                  }
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

          <div className="SettingEntryDivider"></div>

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
                  className={settingSidebarShouldShrinkBody ? 'Active' : null}
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
                  className={!settingSidebarShouldShrinkBody ? 'Active' : null}
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

          <div className="SettingEntryDivider"></div>

          <div className="SettingEntryContainer">
            <div className="SettingEntryTitle">
              <IoIosBarcode className="SettingEntryTitleIcon" />
              Display tab title:
            </div>
            <form className="SettingEntryContent">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label
                  className={settingDisplayTabTitleInFull ? 'Active' : null}
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
                  className={!settingDisplayTabTitleInFull ? 'Active' : null}
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
  }
}

export default SettingsBox;
