var eventBus = new Vue()


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: 
`        <div class="product">
            <div class="product-image">
                <img v-bind:src="image"/>
            </div>
            
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">В наличии</p>
                <p 
                v-else
                :class="{ outOfStock: !inStock}"
                >Не в наличии</p>
                <p>{{ sale }}</p>
                <p>Доставка: {{ shipping }}</p>

                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div 
                class="color-box"
                v-for="(variant, index) in variants" 
                :key="variant.variantId"
                :style="{ backgroundColor:variant.variantColor }"
                @mouseover="updateProduct(index)">
                </div>
        
                <button 
                v-on:click="addToCard"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock}"
                >Добавить в корзину</button>
                <button v-on:click="removeToCart">Удалить с корзины</button>
                
              
            
        </div>

            <product-tabs :reviews="reviews"></product-tabs>

        </div>`,
        data() {
            return {
                product: 'Носки',
                brand: 'Казахстанские',
              //   inventory: 100,
              //   inStock: true,
                onSale: true,
                details: ['70% хлопок', '30% полиэстер', 'Гипоаллергенные'],
                variants: [
                    {
                        variantId: 2234,
                        variantColor: 'Green',
                        variantImage: './asset/img/green.jpg',
                        variantQuantity: 10
                    },
                    {
                        variantId: 2243,
                        variantColor: 'Blue',
                        variantImage: './asset/img/blue.jpg',
                        variantQuantity: 2
                    }
                ],
                reviews: [],
              //   sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
                selectedVariant: 0
            }
        },
              computed: {
               title(){
                  return this.brand + ' ' + this.product;
               },
               image(){
                   return this.variants[this.selectedVariant].variantImage;
               },
               inStock(){
                   return this.variants[this.selectedVariant].variantQuantity;
               },
               sale(){
                      if (this.onSale) {
                        return this.brand + ' ' + this.product + ' по скидке!'
                      } 
                        return  this.brand + ' ' + this.product + ' без скидки!'
               },
               shipping(){
                   if(this.premium){
                       return "Бесплатно"
                   } else {
                       return 19.99
                   }
               }
              },
              methods: {
                  updateProduct(index){
                      this.selectedVariant = index;
                      console.log('Изменение изображния');
                  },
                  addToCard() {
                    this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
                    console.log('пользовательское событие нажатия кнопки');
                  },
                  removeToCart(){
                    this.$emit('remove-to-cart', this.variants[this.selectedVariant].variantId);
                    console.log('пользовательское событие нажатия кнопки удаления');
                  },
                  addReview(productReview) {
                    this.reviews.push(productReview)}
              },
              mounted() {
                eventBus.$on('review-submitted', productReview => {
                  this.reviews.push(productReview)
                })
              }
})

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <p class="error" v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>

        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name" placeholder="name">
        </p>
        
        
        <p>
          <label for="review">Review:</label>
          <textarea id="review" v-model="review"></textarea>
        </p>
  
        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>

        <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>

        <p>
          <input type="submit" value="Submit">  
        </p>
  
    </form>
    `,
    data() {
      return {
        name: null,
        review: null,
        rating: null,
        errors: []
      }
    },
    methods: {
        onSubmit() {
            this.errors = []
            if(this.name && this.review && this.rating) {
              let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
              }
              eventBus.$emit('review-submitted', productReview)
              this.name = null
              this.review = null
              this.rating = null
            } else {
              if(!this.name) this.errors.push("Name required.")
              if(!this.review) this.errors.push("Review required.")
              if(!this.rating) this.errors.push("Rating required.")
            }
          },    
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
          type: Array,
          required: false
        }
      },
    template: `
    <div> 

        <div>
            <span 
            class="tab" 
            :class="{ activeTab: selectedTab === tab }"
            v-for="(tab, index) in tabs" 
            :key="index" 
            @click="selectedTab = tab"
            >{{ tab }}</span>
        </div>

        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="review in reviews" :key="index">
                <p>{{ review.name }}</p>
                <p>Rating:{{ review.rating }}</p>
                <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>

        <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>
    </div>
`,
data() {
    return {
    tabs: ['Reviews', 'Make a Review'],
    selectedTab: 'Reviews'     
    }
}
})


var app = new Vue({
    el: '#app',
    data: {
      premium: true,
      cart: []
    },
    methods: {
        updateCart(id){
            this.cart.push(id);
            console.log('Обновление значения');
        },
        removeItem(id) {
            for(var i = this.cart.length - 1; i >= 0; i--) {
              if (this.cart[i] === id) {
                 this.cart.splice(i, 1);
              }
            }
          }
    }
})