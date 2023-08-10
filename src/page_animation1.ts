import { LitElement, html, css } from 'lit';
import { styles } from './style_scripts/modified-material-components-web.min.css.js';
import { customElement, property, query, state } from 'lit/decorators.js';

@customElement('page-animation1')  // ts
class PageAnimations1 extends LitElement {

  static styles = [
    styles,
    css`
      :host {
        display: block;
        --fa-style-family-classic: 'Font Awesome 6 Free';
        --fa-font-solid: normal 900 1em/1 'Font Awesome 6 Free';
      }

      body {
        background-color: rgb(255, 20, 20);
        height: 100vh;    
        margin: 0px;  
        
        display: flex;
        align-items: center;
        justify-content: center;
        gap: clamp(10px, 4vw, 100px);
      }
      
      /* When the trailer is active, show the icon. */
      /* CSS meaning: when the trailer has a data-type attribute that is not undefined, set the opacity on the #trailer element to 1. */
      #trailer:not([data-type="undefined"]) > #trailer {
        opacity: 1;
      }
      
      #trailer {
        height: 20px;
        width: 20px;
        background-color: red;
        border-radius: 20px;
        
        position: fixed;
        left: 0px;
        top: 0px;
        z-index: 10000;
        
        pointer-events: none;
        opacity: 0;
        transition: opacity 500ms ease;
        
        display: grid;
        place-items: center;
      }
      
      /* When the trailer is active, show the icon. */
      /* CSS meaning: when the trailer has a data-type attribute that is not undefined, set the opacity on the #trailer-icon element to 1. */
      #trailer:not([data-type="undefined"]) > #trailer-icon {
        opacity: 1;
      }
      
      #trailer-icon {
        font-size: 6px;
        line-height: 4px;
        
        opacity: 0;
        transition: opacity 400ms ease;
      }
      
      .interactable {
        aspect-ratio: 1 / 1.5;
        width: clamp(120px, 40vmin, 600px);
        background-position: center 50%;
        background-size: 100%;  
        opacity: 0.4;
        
        transition: background-size 400ms ease, opacity 400ms ease;
      }
      
      .interactable:hover {
        background-size: 105%;
        opacity: 0.8;
      }
    `];

  // @state()
  // result: string

  @query("#trailer")
  trailIconEl!: HTMLElement

  private _fontAwesomeHref = "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.2/css/all.min.css";

  constructor() {
    super();
    // super().attachShadow({mode:'open'})
    //        .innerHTML = `<style>@import url('${href}')</style>`+
    //        [`check`,`square-check`,`circle-check`,`gear`]
    //          .map(icon=>`fa-${icon}: <i class="fa fa-${icon}"></i><br>`).join("");

    // If font has not been loaded yet, load it now.
    // Note: should pre-load font in <head> instead, but this will force it to load.
    if (!document.querySelector(`link[href="${this._fontAwesomeHref}"]`)) {
      document.head.append(
        Object.assign(document.createElement("link"), {
          rel: "stylesheet",
          href: this._fontAwesomeHref
        }))
    };
  }

  firstUpdated() {
    
    const animateTrail = (
      evt: { clientX: number; clientY: number; }, 
      isInteracting: boolean
    ) => {
      const x = evt.clientX - this.trailIconEl.offsetWidth / 2,
            y = evt.clientY - this.trailIconEl.offsetHeight / 2;
      
      const keyframes = 
        [{
          transform: `translate(${x}px, ${y}px) scale(${isInteracting ? 8 : 1})`,
          opacity: isInteracting ? 1 : 0
        }]
      
      this.trailIconEl.animate(
        keyframes, { 
          duration: 800, 
          fill: "forwards" 
        }
      );
    }

    const getTrailerClass = (type: "video" | "link") => {
      switch(type) {
        case "video":
          return "fa-solid fa-play"; // play video
        case "link":
          return "fa-solid fa-arrow-up-right-from-square";  // go to link
        default:
          return "fa-solid fa-question-circle"; // unknown
      }
    }

    // window.onmousemove = e => {
    window.onmousemove = evt => {
      const icon: HTMLElement = this.shadowRoot?.getElementById("trailer-icon") as HTMLElement;
      const interactTargetEl: HTMLElement | null = 
          evt.composedPath()
            .find((evt: any) => 
              evt.classList?.contains("interactable")
            ) as HTMLElement | null
      const isInteracting: boolean = interactTargetEl !== undefined

      animateTrail(evt, isInteracting);
      
      this.trailIconEl.dataset.type = isInteracting ? interactTargetEl?.dataset.type : "";
      if(isInteracting) {
        icon.className = getTrailerClass(interactTargetEl?.dataset.type as "video" | "link" ?? "");
      }
    }
  }

  private _onInteractableClick = (evt: Event) => {
    const targetEl: HTMLElement | null =
      evt.composedPath()
        .find((evt: any) =>
          evt.classList?.contains("interactable")
        ) as HTMLElement | null
    
    if(targetEl) {
      const link = targetEl.getAttribute("href");
      if(link) {
        window.open(link, "_blank");
      }
    }
  }

  render() {
    return html`
      <!-- Import the fontawesome stylesheet: -->
      <link rel="stylesheet" href="${this._fontAwesomeHref}" crossorigin="anonymous" referrerpolicy="no-referrer" />

      <div class="wrapper">
        <i style="color:white;" class="fa-solid fa-play"></i><br>
        <i style="color:white;" class="fa-solid fa-arrow-up-right-from-square"></i>
        <i style="color:white;" class="fa-solid fa-square-check"></i>
        <i style="color:white;" class="fa-solid fa-circle-check"></i>
        <i style="color:white;" class="fa-solid fa-gear"></i>
        
        <h1>This is the page for Animation 1</h1>
        <br>
        <br>

        <div id="trailer">
          <i id="trailer-icon" class="fa-solid up-right-from-square"></i>
        </div>

        <div @click="${this._onInteractableClick}">
          <div 
            class="interactable" 
            data-type="link"
            href="https://youtu.be/CZIJKkwc8l8"
            style="background-image: url(https://images.unsplash.com/photo-1657739774592-14c8f97eaece?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60)">
          </div>
          
          <div 
          class="interactable" 
            data-type="video"
            href="https://www.youtube.com/watch?v=it4kMDbmOd4"
            style="background-image: url(https://images.unsplash.com/photo-1657779582398-a13b5896ff19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60)">     
          </div>
        </div>

      </div>
    `
  }

}


