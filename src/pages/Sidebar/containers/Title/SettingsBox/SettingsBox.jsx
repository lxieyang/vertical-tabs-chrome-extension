import React, { Component } from 'react';
import { MdSettings } from 'react-icons/md';

import './SettingsBox.css';

class SettingsBox extends Component {
  render() {
    const { settingSidebarLocation, setSettingSidebarLocation } = this.props;

    return (
      <div
        style={{
          backgroundColor: '#fff',
          opacity: 1,
          color: 'inherit',
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
            <div className="SettingEntryTitle">Sidebar Position:</div>
            <div className="SettingEntryContent">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label>
                  Left
                  <input
                    type="radio"
                    checked={settingSidebarLocation === 'left'}
                    onChange={() => setSettingSidebarLocation('left')}
                    name="radio"
                  />
                </label>
                <label>
                  Right
                  <input
                    type="radio"
                    checked={settingSidebarLocation !== 'left'}
                    onChange={() => setSettingSidebarLocation('right')}
                    name="radio"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* <div className="SettingEntryDivider"></div> */}
        </div>
      </div>
    );
  }
}

export default SettingsBox;
