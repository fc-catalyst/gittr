<template>
  <div>
    <div class="heading-container">
      <div class="bg-top">
        <div class="heading">
          <h1>Blog</h1>
          <div class="categories">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category"
            >
              <Category
                :category="category"
                @selected="changeSelectedCategories($event, category)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content" v-if="!loading">
      <div class="posts">
        <div v-for="(post, i) in shownPosts" :key="post.id" class="post">
          <Post :post="post" :color="colors[i % colors.length]" />
        </div>
      </div>
      <div>
        <paginate
          :page-count="pageCount"
          :prev-text="''"
          :next-text="''"
          :click-handler="updateShownPosts"
          :container-class="'pagination'"
          :page-class="'page-item'"
          :page-link-class="'page-link-item'"
        >
          >
        </paginate>
      </div>
    </div>

    <div class="newsletter">
      <Newsletter />
    </div>
    <div class="footer">
      <Footer />
    </div>
    <div class="bg-bottom-shapes"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      categories: [],
      posts: [],
      selectedCatgeories: [],
      shownPosts: [],
      pageCount: 1,
      pageNum: 1,
      numberOfPostsOnPage: 6,
      colors: ['#FFFFFF', '#FFB72C', '#C038F0', '#3FA0C7', '#FF912D', '#F06437']
    };
  },

  async created() {
    this.loading = true;
    await this.$store.dispatch('fetchPosts');
    await this.$store.dispatch('fetchCategories');
    const { getters } = this.$store;
    this.categories = getters.getCategories;
    this.posts = getters.getPosts;
    this.shownPosts = Array.from(this.posts);
    this.filterPosts();
    this.loading = false;
  },
  mounted() {
    document.querySelector('body').style.backgroundColor =
      'var(--clr-purple-100)';
    document.getElementsByClassName('nav')[0].style.color =
      'var(--clr-purple-100)';
    document.getElementsByClassName('link')[0].className = 'link purple';
    document.getElementsByClassName('link')[1].className = 'link purple';
  },

  methods: {
    changeSelectedCategories(event, category) {
      if (event == true && this.selectedCatgeories.indexOf(category) == -1) {
        this.selectedCatgeories.push(category);
      } else {
        this.selectedCatgeories.splice(
          this.selectedCatgeories.indexOf(category),
          1
        );
      }
      this.filterPosts();
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    filterPosts() {
      if (this.selectedCatgeories.length == 0) {
        this.shownPosts = Array.from(this.posts);
        this.calculateShownPostsBasedOnPageNumber();
        this.calculatePageCount(this.posts);
      } else {
        this.shownPosts = [];
        var copiedPosts = Array.from(this.posts);
        for (const post in copiedPosts) {
          var inside = false;
          for (const category in copiedPosts[post].categories) {
            for (const sc in this.selectedCatgeories) {
              if (
                this.selectedCatgeories[sc].id ==
                copiedPosts[post].categories[category]
              )
                inside = true;
            }
          }
          if (inside == true) this.shownPosts.push(copiedPosts[post]);
          this.calculatePageCount(this.shownPosts);
        }
        this.calculateShownPostsBasedOnPageNumber();
      }
    },
    updateShownPosts(pageNum) {
      this.pageNum = pageNum;
      this.filterPosts();
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    calculateShownPostsBasedOnPageNumber() {
      let r = this.pageNum - 1;
      let startIndex = r * this.numberOfPostsOnPage;
      if (this.shownPosts.length > this.numberOfPostsOnPage) {
        this.shownPosts = this.shownPosts.splice(
          startIndex,
          this.numberOfPostsOnPage
        );
      }
    },
    calculatePageCount(posts) {
      this.pageCount = posts.length / this.numberOfPostsOnPage;
    }
  }
};
</script>

<style lang="scss" scoped>
.heading-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  .bg-top {
    z-index: -100;
    width: 100%;
    min-height: 200px;
    background-image: url('../../assets/backgrounds/bg-top-purple.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: bottom;

    @media (min-width: 87.5em) {
      min-height: 450px;
    }
  }
  .heading {
    position: relative;
    z-index: 1;
    padding: 2rem;
    text-align: center;
    h1 {
      color: var(--clr-white-100);
      font-size: 2.5rem;
      font-weight: var(--fw-bold);
      margin: 0;
      @media (min-width: 87.5em) {
        font-size: 4rem;
      }
    }
    .categories {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }
  }
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  .posts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  .page-item {
    margin: 0 0.5rem;
    .page-link-item {
      padding: 0.5rem 1rem;
      border: 1px solid var(--clr-purple-300);
      border-radius: 0.25rem;
      color: var(--clr-purple-300);
      text-decoration: none;
      transition: all 0.3s ease;
      &:hover {
        background-color: var(--clr-purple-300);
        color: var(--clr-white-100);
      }
    }
  }
}

.newsletter {
  margin-top: 4rem;
}

.footer {
  margin-top: 4rem;
}

.bg-bottom-shapes {
  background-image: url('../../assets/backgrounds/bg-bottom-purple-shapes.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top;
  min-height: 200px;
  margin-top: 4rem;
}
</style>
