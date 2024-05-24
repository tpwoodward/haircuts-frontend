import App from './../../App'
import {html, render } from 'lit'
import {gotoRoute, anchorRoute} from './../../Router'
import Auth from './../../Auth'
import Utils from './../../Utils'
import HaircutAPI from './../../HaircutAPI'
import Toast from './../../Toast'

class HaircutsView {
  async init(){
    document.title = 'Haircuts'    
    this.haircuts = null
    this.render()    
    Utils.pageIntroAnim()
    await this.getHaircuts()
    // this.filterHaircuts('price', '30-40')
  }

  async filterHaircuts(field, match){
    // validate
    if(!field || !match) return

    // get fresh copy of the haircuts
    this.haircuts = await HaircutAPI.getHaircuts()

    let filteredHaircuts

    // gender
    if(field == 'gender'){
      filteredHaircuts = this.haircuts.filter(haircut => haircut.gender == match)
    }

    // length
    if(field == 'length'){
      filteredHaircuts = this.haircuts.filter(haircut => haircut.length == match)
    }

    // price
    if(field == 'price'){
      // get priceRangeStart
      const priceRangeStart = match.split('-')[0]
      const priceRangeEnd = match.split('-')[1]
      filteredHaircuts = this.haircuts.filter(haircut => haircut.price >= priceRangeStart && haircut.price <= priceRangeEnd)
    }

    // render
    this.haircuts = filteredHaircuts
    this.render()

  }

  clearFilterBtns(){
    const filterBtns = document.querySelectorAll('.filter-btn')
    filterBtns.forEach(btn => btn.removeAttribute("variant") )
  }

  
  handleFilterBtn(e){
    // clear all filter buttons
    this.clearFilterBtns()

    // set button active (variant = primary)
    e.target.setAttribute("variant", "primary")

    // extract the field and match from the button
    const field = e.target.getAttribute("data-field")
    const match = e.target.getAttribute("data-match")

    // filter haircuts
    this.filterHaircuts(field, match)

  }

  clearFilters(){
    this.getHaircuts()
    this.clearFilterBtns()
  }


  async getHaircuts(){
    try{
      this.haircuts = await HaircutAPI.getHaircuts()
      console.log(this.haircuts)
      this.render()
    }catch(err){
      Toast.show(err, 'error')
    }
  }

  render(){
    const template = html`
      <style>
        .filter-menu {
          display: flex;
          align-items: center;
        }

        .filter-menu > div {
          margin-right: 1em;
        }
      </style>

      <va-app-header title="Haircuts" user="${JSON.stringify(Auth.currentUser)}"></va-app-header>
      <div class="page-content">    
        
        <div class="filter-menu">
          <div>
            Filter by
          </div>
          <div>
            <strong>Gender</strong>
              <sl-button class="filter-btn" size="small" data-field="gender" data-match="m" @click=${this.handleFilterBtn.bind(this)}>M</sl-button>
              <sl-button class="filter-btn" size="small" data-field="gender" data-match="f" @click=${this.handleFilterBtn.bind(this)}>F</sl-button>
              <sl-button class="filter-btn" size="small" data-field="gender" data-match="u" @click=${this.handleFilterBtn.bind(this)}>U</sl-button>
          </div>
          <div>
            <strong>Length</strong>
              <sl-button class="filter-btn" size="small" data-field="length" data-match="s" @click=${this.handleFilterBtn.bind(this)}>S</sl-button>
              <sl-button class="filter-btn" size="small" data-field="length" data-match="m" @click=${this.handleFilterBtn.bind(this)}>M</sl-button>
              <sl-button class="filter-btn" size="small" data-field="length" data-match="l" @click=${this.handleFilterBtn.bind(this)}>L</sl-button>
          </div>
          <div>
            <strong>Price</strong>
              <sl-button class="filter-btn" size="small" data-field="price" data-match="10-20" @click=${this.handleFilterBtn.bind(this)}>$10-20</sl-button>
              <sl-button class="filter-btn" size="small" data-field="price" data-match="20-30" @click=${this.handleFilterBtn.bind(this)}>$20-30</sl-button>
              <sl-button class="filter-btn" size="small" data-field="price" data-match="30-40" @click=${this.handleFilterBtn.bind(this)}>$30-40</sl-button>
          </div>
          <div>
            <sl-button size="small" @click=${this.clearFilters.bind(this)}>Clear Filters</sl-button>
          </div>
        </div>

      
      <div class="haircuts-grid">
      ${this.haircuts == null ? html`
        <sl-spinner></sl-spinner>
      ` : html`
        ${this.haircuts.map(haircut => html`
          <va-haircut class="haircut-card"
            id="${haircut._id}"
            name="${haircut.name}"
            description="${haircut.description}"
            price="${haircut.price}"
            user="${JSON.stringify(haircut.user)}"
            image="${haircut.image}"
            gender="${haircut.gender}"
            length="${haircut.length}"
          >
          </va-haircut>
        `)}
      `}
      </div>
        
      </div>      
    `
    render(template, App.rootEl)
  }
}


export default new HaircutsView()