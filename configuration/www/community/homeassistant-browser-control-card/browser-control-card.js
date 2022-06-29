var wake_lock_supported,css_zoom_supported;"wakeLock"in navigator&&"request"in navigator.wakeLock?wake_lock_supported=!0:(wake_lock_supported=!1,console.warn("Browser Control Card: Wake Lock API not supported by this browser."));try{CSS.supports("zoom","1")?css_zoom_supported=!0:(css_zoom_supported=!1,console.warn("Browser Control Card: CSS Zoom not supported by this browser."))}catch(error){css_zoom_supported=!0,console.warn("Browser Control Card: CSS Zoom may not be supported by this browser.")}let wakeLock=null;const requestWakeLock=async()=>{try{wakeLock=await navigator.wakeLock.request("screen")}catch(e){wakeLock=null}},cancelWakeLock=()=>{wakeLock.release(),wakeLock=null},handleVisibilityChange=()=>{null!==wakeLock&&"visible"===document.visibilityState&&requestWakeLock()},fullscreen_icon='<ha-icon icon="mdi:fullscreen"></ha-icon>',fullscreen_exit_icon='<ha-icon icon="mdi:fullscreen-exit"></ha-icon>',wake_lock_icon='<ha-icon icon="mdi:sleep"></ha-icon>',wake_unlock_icon='<ha-icon icon="mdi:sleep-off"></ha-icon>',zoom_in_icon='<ha-icon icon="mdi:magnify-plus"></ha-icon>',zoom_out_icon='<ha-icon icon="mdi:magnify-minus"></ha-icon>',refresh_icon='<ha-icon icon="mdi:refresh"></ha-icon>',small_buttons_css_style="border: 2px solid var(--primary-color);padding: 0.5em;display: inline-block;background: var(--primary-color);color: var(--primary-background-color);text-align: center;border-radius: var(--ha-card-border-radius, 4px);cursor: pointer;margin-right: 5px;margin-bottom: 2px;margin-top: 2px;",buttons_css_style=small_buttons_css_style+"font-size: 2em;";function getButtonCssStyle(small_buttons){return small_buttons?small_buttons_css_style:buttons_css_style}class BrowserControlCard extends HTMLElement{set hass(hass){this._hass=hass}setConfig(config){if(this.config=config,this.config){for(this.content=document.createElement("ha-card"),this.config.no_padding||(this.content.style.padding="15px"),this.config.hide_fullscreen||(this.fullscreen=!1,this.fullscreenbtn=document.createElement("a"),this.fullscreenbtn.innerHTML=fullscreen_icon,this.fullscreenbtn.style.cssText=getButtonCssStyle(this.config.small_buttons),this.fullscreenbtn.onclick=function(){this.fullscreen?(document.exitFullscreen(),this.fullscreenbtn.innerHTML=fullscreen_icon):(document.documentElement.requestFullscreen(),this.fullscreenbtn.innerHTML=fullscreen_exit_icon),this.fullscreen=!this.fullscreen}.bind(this),this.content.appendChild(this.fullscreenbtn)),!this.config.hide_screenlock&&wake_lock_supported&&(this.wake_lock=!1,this.nowakebtn=document.createElement("a"),this.nowakebtn.innerHTML=wake_lock_icon,this.nowakebtn.style.cssText=getButtonCssStyle(this.config.small_buttons),this.nowakebtn.onclick=function(){this.wake_lock?(document.removeEventListener("visibilitychange",handleVisibilityChange),document.removeEventListener("fullscreenchange",handleVisibilityChange),cancelWakeLock(),this.nowakebtn.innerHTML=wake_lock_icon):(requestWakeLock(),document.addEventListener("visibilitychange",handleVisibilityChange),document.addEventListener("fullscreenchange",handleVisibilityChange),this.nowakebtn.innerHTML=wake_unlock_icon),this.wake_lock=!this.wake_lock}.bind(this),this.content.appendChild(this.nowakebtn)),!this.config.hide_zoom&&css_zoom_supported&&(this.zoom_level=1,this.zoominbtn=document.createElement("a"),this.zoominbtn.innerHTML=zoom_in_icon,this.zoominbtn.style.cssText=getButtonCssStyle(this.config.small_buttons),this.zoominbtn.onclick=function(){this.zoom_level=this.zoom_level+.1,document.body.style.zoom=this.zoom_level}.bind(this),this.content.appendChild(this.zoominbtn),this.zoomoutbtn=document.createElement("a"),this.zoomoutbtn.innerHTML=zoom_out_icon,this.zoomoutbtn.style.cssText=getButtonCssStyle(this.config.small_buttons),this.zoomoutbtn.onclick=function(){this.zoom_level=this.zoom_level-.1,this.zoom_level<0?this.zoom_level=0:document.body.style.zoom=this.zoom_level}.bind(this),this.content.appendChild(this.zoomoutbtn)),this.config.hide_refresh||(this.refreshbtn=document.createElement("a"),this.refreshbtn.innerHTML=refresh_icon,this.refreshbtn.style.cssText=getButtonCssStyle(this.config.small_buttons),this.refreshbtn.onclick=function(){document.location.reload()}.bind(this),this.content.appendChild(this.refreshbtn));this.firstChild;)this.removeChild(this.firstChild);this.appendChild(this.content)}}static getStubConfig(){return{hide_fullscreen:!1,hide_screenlock:!1,hide_zoom:!1,hide_refresh:!1,no_padding:!1,small_buttons:!1}}getCardSize(){return 2}static getConfigElement(){return document.createElement("browser-control-card-editor")}}customElements.define("browser-control-card",BrowserControlCard);import{html,css,LitElement}from"https://unpkg.com/lit?module";class BrowserControlCardEditor extends LitElement{static get properties(){return{hass:{},_config:{}}}setConfig(config){this._config=config}fireEvent(){const event=new Event("config-changed",{bubbles:!0,composed:!0});event.detail={config:this._config},this.dispatchEvent(event)}fullscreenChange(ev){this._config.hide_fullscreen=!ev.target.checked,this.fireEvent()}screenLockChange(ev){this._config.hide_screenlock=!ev.target.checked,this.fireEvent()}zoomChange(ev){this._config.hide_zoom=!ev.target.checked,this.fireEvent()}refreshChange(ev){this._config.hide_refresh=!ev.target.checked,this.fireEvent()}noPaddingChange(ev){this._config.no_padding=ev.target.checked,this.fireEvent()}smallButtonsChange(ev){this._config.small_buttons=ev.target.checked,this.fireEvent()}render(){return this.hass&&this._config?html`
      <ul class="switches">
        <h2>Buttons</h2>
        Note: some buttons may be hidden if your current browser does not
        support the feature
        <li class="switch">
          <ha-switch
            .checked=${!this._config.hide_fullscreen}
            @change="${this.fullscreenChange}"
          >
          </ha-switch
          ><span><ha-icon icon="mdi:fullscreen"></ha-icon></span>
        </li>
        <li class="switch">
          <ha-switch
            .checked=${!this._config.hide_screenlock}
            @change="${this.screenLockChange}"
          >
          </ha-switch
          ><span><ha-icon icon="mdi:sleep"></ha-icon></span>
        </li>
        <li class="switch">
          <ha-switch
            .checked=${!this._config.hide_zoom}
            @change="${this.zoomChange}"
          >
          </ha-switch
          ><span
            ><ha-icon icon="mdi:magnify-plus"></ha-icon> /
            <ha-icon icon="mdi:magnify-minus"></ha-icon
          ></span>
        </li>
        <li class="switch">
          <ha-switch
            .checked=${!this._config.hide_refresh}
            @change="${this.refreshChange}"
          >
          </ha-switch
          ><span><ha-icon icon="mdi:refresh"></ha-icon></span>
        </li>
        <h2>Style</h2>
        <li class="switch">
          <ha-switch
            .checked=${this._config.no_padding}
            @change="${this.noPaddingChange}"
          >
          </ha-switch
          ><span
            >No white space (padding) between buttons and card borders</span
          >
        </li>
        <li class="switch">
          <ha-switch
            .checked=${this._config.small_buttons}
            @change="${this.smallButtonsChange}"
          >
          </ha-switch
          ><span>Smaller buttons</span>
        </li>
      </ul>
    `:html``}static get styles(){return css`
      .switches {
        margin: 8px 0;
        list-style: none;
        padding: 0;
      }
      .switch {
        display: flex;
        align-items: center;
        height: 40px;
      }
      .switches span {
        padding: 0 16px;
      }
    `}}customElements.define("browser-control-card-editor",BrowserControlCardEditor),window.customCards=window.customCards||[],window.customCards.push({type:"browser-control-card",name:"Browser Control Card",preview:!0,description:"Card to control browser settings: full-screen, wake lock, zoom..."});