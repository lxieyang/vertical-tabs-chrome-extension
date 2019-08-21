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

import './SettingsBox.css';

class SettingsBox extends Component {
  render() {
    const {
      settingSidebarLocation,
      setSettingSidebarLocation,
      settingSidebarShouldShrinkBody,
      setSettingSidebarShouldShrinkBody,
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
                <label>
                  <input
                    type="radio"
                    checked={settingSidebarLocation === 'left'}
                    onChange={() => setSettingSidebarLocation('left')}
                    name="radio"
                  />
                  <FaAlignLeft className="SettingEntryOptionIcon" />
                  Left
                </label>
                <label>
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
                <label>
                  <input
                    type="radio"
                    checked={settingSidebarShouldShrinkBody}
                    onChange={() => setSettingSidebarShouldShrinkBody(true)}
                    name="radio"
                  />
                  <FaCheck className="SettingEntryOptionIcon" />
                  Yes
                </label>
                <label>
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
        </div>
      </div>
    );
  }
}

export default SettingsBox;
