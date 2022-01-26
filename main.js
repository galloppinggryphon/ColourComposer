/**
 * Name: Colour Composer
 * Version: 0.1
 * Author: Bjornar Egede-Nissen
 * License: MIT
 * URL: https://github.com/galloppinggryphon/ColourComposer
 */

'use strict'

const { log } = console

const pickerOptions = {
	theme: 'monolith', // 'classic', // or 'monolith', or 'nano'
	inline: true,
	showAlways: true,
	sliders: 'h',

	defaultRepresentation: 'HSLA',

	swatches: [ '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00', '#ffffff00' ],

	default: '#9C27B0',

	components: {
		preview: true,
		opacity: true,
		hue: true,

		interaction: {
			hex: true,
			rgba: true,
			hsla: true,
			input: true,
			cancel: true,
			clear: false,
			save: true,
		},
	},

	i18n: {
		'btn:cancel': 'Reset',
	},
}

const defaultColourSets = [
	{
		title: 'Blue 1',
		isNew: false,
		colours: [
			{
				hex: '#85c1e9', //or rgba/hsla
			},
			{
				hex: '#3498db',
			},
			{
				hex: '#1b4f72',
			},
		],
	},
	{
		title: 'Red 1',
		isNew: false,
		colours: [
			{
				hex: '#FF6565',
			},
			{
				hex: '#F44336',
			},
			{
				hex: '#990000',
			},
		],
	},
]

const ColourPicker = {
	name: 'colour-picker',

	data() {
		return {
			picker: undefined,
			disableUpdate: false,
			enableSave: false,
			enableUpdate: false,
		}
	},

	template: `<div :class="this.classNames"><div></div></div>`,

	props: [ 'currentColour', 'updateColour' ],

	mounted() {
		pickerOptions.el = this.$el.firstChild
		this.picker = Pickr.create( pickerOptions )
		this.picker.on( 'save', this.saveColour )
	},

	watch: {
		currentColour: {
			immediate: true,
			handler( val ) {
				if ( val && val.hasOwnProperty( 'hex' ) ) {
					this.picker.setColor( val.hex, true )
					this.enableUpdate = false
					this.enableSave = true
				}
				else {
					this.enableSave = false
				}
			},
		},
	},

	computed: {
		classNames() {
			return {
				'colour-picker': true,
				'disable-save': ! this.enableSave,
			}
		},
	},

	methods: {
		saveColour( colour ) {
			console.info( '=== saveColour ===' )
			this.updateColour( colour )
		},
	},
}

const ColourCard = {
	name: 'colour-card',
	data() {
		return {
			me: 'ColourCard',
			selected: false,
			isNew: false,
		}
	},
	props: [ 'addColour', 'colourSet', 'colourSets', 'data', 'deleteCurrentColourSet', 'setCurrentColour', 'setCurrentColourSet', 'state', 'updateColourSet' ],

	template: `
		<slot
			:state="state"
			:colour-set="colourSet"
			:add-colour="addColour"
			:edit-title="editTitle"
			:delete-set="deleteSet"
			:cancel-action="cancelAction"
			:is-active="isActive"
			:new-colour="newColour"
			:class-names="classNames"
		/>`,

	computed: {
		isCardModal() {
			log( '! this.state.isCardModal', this.state.isCardModal )
			return this.state.isCardModal
		},
		isActive() {
			return this.data.currentColourSet && this.colourSet.id === this.data.currentColourSet.id
		},
		classNames() {
			return {
				column: true,
				'colour-card': true,
				'card-new': this.isNew,
				'card-active': this.isActive,
			}
		},
	},

	methods: {
		newColour() {
			this.addColour( this.colourSet.id )
		},

		cancelAction() {
			this.state.setAction( null )
		},

		deleteSet() {
			console.clear()

			const action = 'deleteSet'
			const { state } = this
			log( state )

			if ( state.isCardModal && ! state.currentAction === action ) {
				return
			}

			this.setCurrentColourSet( this.colourSet.id )

			if ( state.currentAction === action ) {
				this.deleteCurrentColourSet()
				state.setAction( null )
			}
			else {
				state.setAction( action )
			}
		},

		editTitle( e ) {
			const action = 'editTitle'
			const { state } = this

			console.clear()

			if ( state.isCardModal && ! state.currentAction === action ) {
				return
			}

			this.setCurrentColourSet( this.colourSet.id )

			if ( state.currentAction === action ) {
				const input = e.target.parentNode.parentNode.querySelector( 'input' )
				this.updateColourSet( this.colourSet.id, 'title', input.value )
				state.setAction( null )
			}
			else {
				state.setAction( action )
			}
		},
	},

	mounted() {
		if ( this.colourSet.isNew ) {
			setTimeout( () => this.className = 'card-new', 1 )
			this.isNew = true
		}
	},
}

const ColourItem = {
	name: 'colour-item',
	computed: {
		classNames() {
			return {
				'colour-item': true,
				'is-active': this.isSelected,
			}
		},
		previewStyle() {
			return {
				backgroundColor: this.colour.hex,
			}
		},
		btnStyle() {
			return {
				color: this.textColour,
			}
		},
		textColour() {
			return getContrastColour( this.colour.hex )
		},
		isSelected() {
			return this.data.currentColourSet && this.data.currentColourSet.id === this.colourSet.id && this.data.currentColour.id === this.colour.id
		},
	},

	props: [ 'state', 'data', 'colour', 'colourSet', 'deleteColour', 'setCurrentColour', 'deleteColour' ],

	template: `
	<li
	  :class="this.classNames"
	>
		<div class="colour-preview"
			:style="this.previewStyle"
		>
			<button
				class="btn-transparent"
	  			@click="colourClick"
				:style="this.btnStyle"
				>
				{{colour.hex}}
			</button>
			<div class="actions">
				<!--
				<button class="btn-icon">
					<i class="icon las la-angle-up"></i>
				</button>
				-->
				<!--
				<button class="btn-icon">
					<i class="icon las la-angle-down"></i>
				</button>

				<button class="btn-icon" @click="copyColour">
					<i class="icon las la-angle-down"></i>
				</button>
				-->
				<button class="btn-icon" @click="deleteColourItem">
					<i class="icon las la-times"></i>
				</button>
	  		</div>
	  </div>
	</li>
  `,

	methods: {
		colourClick() {
			if ( ! this.state.isCardModal || this.state.currentAction === 'editColour' ) {
				if ( this.isSelected ) {
					this.setCurrentColour()
				}
				else {
					this.setCurrentColour( this.colourSet.id, this.colour )
				}
			}
		},
		deleteColourItem( e ) {
			log( this.colour )
			this.deleteColour( this.colourSet.id, this.colour.id )
		},
	},
}

const Navbar = {
	name: 'navbar',

	computed: {
		classNames() {
			return {
				'colour-item': true,
				'is-active': this.isSelected,
			}
		},
	},

	props: [ 'clearAll', 'newColourSet', 'saveColourSets', 'loadColourSets', 'exportColourSets', 'state' ],

	template: `
	<slot
		:btnNewSet="btnNewSet"
		:btnReset="btnReset"
		:btnSave="btnSave"
		:btnLoad="btnLoad"
		:btnExport="btnExport"
	/>
  `,

	methods: {
		btnNewSet( e ) {
			this.newColourSet()
		},
		btnSave( e ) {
			this.saveColourSets()
		},
		btnReset() {
			this.clearAll()
		},
		btnLoad( e ) {
			this.loadColourSets()
		},
		btnExport( e ) {
			console.log( e )
			this.state.alert( 'Export is not implemented yet.' )
		},
	},
}

const Alerts = {
	name: 'alerts',

	computed: {
		classNames() {
			return {
				'colour-item': true,
				'is-active': this.isSelected,
			}
		},
	},

	props: [ 'state' ],

	template: `
	<slot
		:btnDismiss="btnDismiss"
		:msg="state.alertMsg"
		:isOpen="state.alertIsOpen"
	/>
  `,

	methods: {
		btnDismiss( e ) {
			console.log( e )
			this.state.dismissAlert()
		},
	},
}

const app = Vue.createApp( {

	components: {
		'colour-card': ColourCard,
		'colour-item': ColourItem,
		'colour-picker': ColourPicker,
		navbar: Navbar,
		alerts: Alerts,
	},

	data() {
		const context = this

		const defaultState = {
			alertIsOpen: false,
			alertMsg: undefined,
			colourSetsString: undefined,
			currentAction: undefined,
			hasEdits: false,
			hasMounted: false,
			isCardModal: false,
			isCardSuperModal: false,
		}

		return {
			data: {
				currentColour: {},
				currentColourSet: undefined,
			},

			colourSets: [],

			state: {
				...defaultState,

				alert( msg ) {
					context.state.alertMsg = msg
					context.state.alertIsOpen = true
				},
				dismissAlert() {
					context.state.alertMsg = ''
					context.state.alertIsOpen = false
				},
				setHasMounted() {
					context.state.hasMounted = true
				},
				setAction( action = undefined ) {
					context.state.currentAction = action
					context.state.isCardModal = !! action
					context.state.isCardSuperModal = false

					if ( [ 'deleteSet', 'editTitle' ].includes( action ) ) {
						context.state.isCardSuperModal = true
					}

					if ( ! action ) {
						context.data.currentColourSet = undefined
					}
				},
				setHasEdits( hasEdits ) {
					context.state.hasEdits = hasEdits
				},
				updateEditState( data ) {
					const colourSetsString = JSON.stringify( data )
					if ( colourSetsString !== context.state.colourSetsString ) {
						context.state.colourSetsString = colourSetsString
						context.state.hasEdits = true
					}
				},
				reset() {
					Object.assign( context.state, defaultState )
				},
			},
		}
	},

	watch: {
		// If data is updated, update hasEdits state
		colourSets: {
			immediate: false,
			deep: true,
			handler( current ) {
				if ( this.state.hasMounted ) {
					this.state.updateEditState( current )
				}
			},
		},

		//Update app class names based on state
		state: {
			immediate: false,
			deep: true,
			handler( current ) {
				const appClasses = document.querySelector( '#app' ).classList

				if ( current.isCardSuperModal ) {
					appClasses.add( 'card-super-modal' )
				}
				else {
					appClasses.remove( 'card-super-modal' )
				}

				if ( current.isCardModal || current.isCardSuperModal ) {
					appClasses.remove( 'enable-card-menu' )
				}
				else {
					appClasses.add( 'enable-card-menu' )
				}
			},
		},
	},

	methods: {

		newColourSet() {
			this.state.setAction()
			this.state.setHasEdits( true )
			this.data.currentColourSet = undefined
			this.data.currentColour = {}

			this.colourSets.push( {
				id: generateUID(),
				title: 'Unnamed',
				isNew: true,
				colours: [],
			} )
		},

		saveColourSets() {
			localStorage.setItem( 'colourSets', JSON.stringify( this.colourSets ) )
			this.state.alert( 'Colour sets saved to localStorage.' )
			this.state.setHasEdits( false )
		},
		loadColourSets( { reset = false, loadDefaults = false } = {} ) {

			if ( reset ) {
				this.colourSets = []
				this.newColourSet()
			}
			else if ( loadDefaults ) {
				this.colourSets = defaultColourSets
			}
			else {
				this.data.currentColour = {}
				this.data.currentColourSet = undefined
				this.state.reset()

				const colourSets = localStorage.getItem( 'colourSets' )
				const json = colourSets && JSON.parse( colourSets )

				if ( Array.isArray( json ) && json.length ) {
					this.colourSets = json
					this.state.alert( 'Colour sets loaded from localStorage.' )
				}
				else {
					this.colourSets = defaultColourSets
					this.state.alert( 'No saved colour sets found -- loading defaults.' )
				}
			}
		},
		exportColourSets() {
		},
		clearAll() {
			this.loadColourSets( { reset: true } )
			this.data.currentColour = {}
			this.data.currentColourSet = undefined
			this.state.reset()
		},

		getColourSet( id ) {
			return this.colourSets.find( ( x ) => x.id === id )
		},

		getColour( colourSet, colourId ) {
			const colourSetItem = typeof value === 'number' ? this.getColourSet( colourSet ) : colourSet
			if ( ! colourSetItem || ! colourSetItem.colours ) {

			}
			return colourSetItem.colours.find( ( colour ) => colour.id === colourId )
		},

		setCurrentColour( colourSetId = undefined, colour = undefined ) {
			if ( ! colour ) {
				this.data.currentColourSet = undefined
				this.data.currentColour = {}
				this.state.setAction()
				return
			}

			const colourSet = this.getColourSet( colourSetId )
			if ( ! colourSet ) {
				return
			}

			this.data.currentColourSet = colourSet
			this.data.currentColour = colour ? colour : {}
			this.state.setAction( 'editColour' )
		},

		setCurrentColourSet( colourSetId = undefined ) {
			if ( ! colourSetId ) {
				this.data.currentColourSet = undefined
			}
			else {
				this.data.currentColourSet = this.getColourSet( colourSetId )
			}
		},

		updateColourSet( colourSetId, key, value ) {
			const colourSet = this.getColourSet( colourSetId )
			colourSet[ key ] = value
		},

		deleteCurrentColourSet() {
			const { currentColourSet } = this.data

			if ( currentColourSet ) {
				this.colourSets = this.colourSets.filter( ( x ) => x.id !== currentColourSet.id )
				this.data.currentColourSet = undefined
			}
		},

		addColour( colourSetId ) {
			const colourSet = this.getColourSet( colourSetId )
			const colour = {
				id: generateUID(),
				hex: pickerOptions.default,
			}
			colourSet.colours.push( colour )
			this.data.currentColourSet = colourSet
			this.data.currentColour = colour
			this.state.setAction( 'editColour' )
		},

		updateColour( colourData ) {
			Object.assign( this.data.currentColour, {
				hex: colourData.toHEXA().toString(),
				hsla: colourData.toHSLA(),
				hsva: colourData.toHSVA(),
				rgba: colourData.toRGBA(),
			} )
		},

		deleteColour( colourSetId, colourId ) {
			log( { colourSetId, colourId } )
			const colourSet = this.getColourSet( colourSetId )
			colourSet.colours = colourSet.colours.filter( ( colour ) => colour.id !== colourId )
		},
	},

	created() {
		document.querySelector( '#app' ).classList.add( 'app' )

		this.loadColourSets( { loadDefaults: true } )

		// Create slugs and IDs, if missing
		this.colourSets.forEach( ( colourSet ) => {
			colourSet.slug = colourSet.title.replace( /\s+/g, '' ).toLowerCase()
			if ( ! colourSet.id ) {
				colourSet.id = generateUID()
			}

			//Create colour IDs, if missing
			colourSet.colours.forEach( ( colour ) => colour.id = colour.id ? colour.id : generateUID() )
		} )
	},

	mounted() {
		this.state.setHasMounted()

		// Prevent navigation if there are unsaved changes
		const context = this
		window.addEventListener( 'beforeunload', function( e ) {

			if ( context.state.hasEdits ) {
				e.preventDefault() // prevent default behavior in Mozilla Firefox - prompt will always be shown
				e.returnValue = '' // Chrome requires returnValue to be set
			}
		} )
	},
} )

app.config.errorHandler = ( err, vm, info ) => {
	// err: error trace
	// vm: component in which error occured
	// info: Vue specific error information such as lifecycle hooks, events etc.

	console.error( info )
	console.debug( vm )
	console.debug( err )
}

// Register a global custom directive called `v-focus`
app.directive( 'focus', {
	//Focus element when mounted
	mounted( el ) {
		el.focus()
	},
} )

app.mount( '#app' )

/**
 * Generate random alpha numeric ID.
 *
 * @param {Object} props
 * @param {number}[props.length=6]
 * @param {boolean}[props.beginWithLetter=true]
 */
function generateUID( { length = 6, beginWithLetter = true } = {} ) {
	// Multiply by 36^12
	const multiplier = 131621703842267140
	const rand = ( Math.random() + 1 ) * multiplier

	let first = ''

	if ( beginWithLetter ) {
		first = Math.round( ( Math.random() * 26 ) + 10 ).toString( 26 )
	}

	const uid = first + rand.toString( 36 )// use first 36 characters
	return uid.substring( 0, length )
}
