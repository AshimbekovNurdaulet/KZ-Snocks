Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
         <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `})


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
                <!-- <p v-if="inventory > 10">In Stock</p> -->
                <!-- <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p> -->
                <p 
                v-else
                :class="{ outOfStock: !inStock}"
                >Не в наличии</p>
                <p>{{ sale }}</p>
                <p>Доставка: {{ shipping }}</p>

                <product-details :details="details"></product-details>
                <!-- <span v-show="onSale">On Sale</span> -->
                <!-- <ul>
                    <li v-for="size in sizes">{{size}}</li>
                </ul> -->
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
                  }
              },
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

// var app = new Vue({
//     el: '#app',
//     data: {
      

//   })