<template>
  <!--    <header class="htmleaf-header" id="hHeader">-->
  <!--        <input type="file" @change="handleFileChange" accept="image/*" ref="fileInput" style="display:none">-->
  <!--        <h1>图像融合系统</h1>-->
  <!--        <p>北邮人制作</p>-->
  <!--        <div class="htmleaf-links">-->
  <!--            <a class="btn btn-link" href="/draft/" title="首页">-->
  <!--                <i class="iconfont icon-home"></i> <span>返回首页</span>-->
  <!--            </a>-->
  <!--        </div>-->

  <!--        <div class="router-btn">-->
  <!--            <router-link to='/draft-canvas' tag="button">草图检索</router-link>-->
  <!--            <button @click=handleUpdateImg>上传前景图</button>-->
  <!--        </div>-->

  <!--    </header>-->
  <div class="main-draft">
    <div class="main-container">
      <div class="header" id="hHeader">
        <input
          type="file"
          @change="handleFileChange"
          accept="image/*"
          ref="fileInput"
          style="display:none"
        />
        <h1>
          Mind Camera:
          <span>所思即所得的图像视频生成工具</span>
        </h1>
        <div class="banner-container">
          <div class="img-container">
            <div class="result">
              <img src="../assets/homepage/result.jpeg" alt />
            </div>
            <div class="origin">
              <img src="../assets/homepage/original.jpeg" alt />
            </div>
          </div>
          <div class="link-container">
            <h2>轻轻几笔，智能修图，如你所愿。</h2>
            <p>强大的人工智能引擎助力</p>
            <div class="router-wrap">
              <router-link to="/draft-canvas" class="router-search" tag="div">
                <span>草图检索</span>
              </router-link>
              <div @click="handleUpdateImg" class="router-upload">
                <span class="el-icon-upload2">上传前景图</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 class="sub-title">简洁设计 人性化操作</h2>
      <section class="section s1 hide">
        <img src="../assets/homepage/s1.jpg" alt class="img tl" />
        <div class="tr">
          <h3>场景智能理解</h3>
          <p>对于大多数常见的物体能够自动判断类别，并智能分割主体</p>
        </div>
      </section>
      <section class="section s2 hide">
        <img src="../assets/homepage/s2.jpg" alt class="img tl" />
        <div class="tr">
          <h3>智能主体选择</h3>
          <p>对于系统无法自动识别的物体，仅需要粗略标出图片中的前景、背景，即可自动识别出要扣取的主体。</p>
        </div>
      </section>
      <section class="section s3 hide">
        <div class="tl">
          <h3>边缘细化</h3>
          <p>通过精细分割笔，简单标注边缘（毛发、衣服等边缘）附近区域，即可轻松附着边缘</p>
        </div>
        <img src="../assets/homepage/s3.jpg" alt class="img tr" />
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapMutations } from "vuex";
import {
  UPDATE_SELECTED_IMG_BASE64,
  UPDATE_SELECTED_IMG_FILE,
  UPDATE_SELECTED_IMG_URL,
} from "../store/mutation-types";

export default {
  name: "MainDraft",
  methods: {
    ...mapMutations([
      UPDATE_SELECTED_IMG_URL,
      UPDATE_SELECTED_IMG_FILE,
      UPDATE_SELECTED_IMG_BASE64,
    ]),
    handleUpdateImg() {
      this.$refs.fileInput.click();
    },
    handleFileChange(e) {
      console.log(1);
      let f = e.target.files[0];
      if (!/image/.test(f.type)) {
        alert("格式错误");
        return;
      }
      this[UPDATE_SELECTED_IMG_FILE](f);
      let fr = new FileReader();
      fr.readAsDataURL(f);
      fr.onload = () => {
        this[UPDATE_SELECTED_IMG_BASE64](fr.result);

        let img = document.createElement("img");
        img.src = URL.createObjectURL(f);
        this.$root.__selectedImg = img;
        this[UPDATE_SELECTED_IMG_URL](img.src);
        localStorage.setItem("selectedImg", img.src);
        this.$router.push("/edit-page");
        this.$refs.fileInput.value = null;
      };
    },
  },
  created() {
    if (document.getElementById("67f85723-d306-4e20-8471-021ab22ac618")) {
      Plotly.newPlot(
        "67f85723-d306-4e20-8471-021ab22ac618",
        [{ type: "scatter3d" }],
        {
          template: {
            data: {
              histogram2dcontour: [
                {
                  type: "histogram2dcontour",
                  colorbar: { outlinewidth: 0, ticks: "" },
                  colorscale: [
                    [0.0, "#0d0887"],
                    [0.1111111111111111, "#46039f"],
                    [0.2222222222222222, "#7201a8"],
                    [0.3333333333333333, "#9c179e"],
                    [0.4444444444444444, "#bd3786"],
                    [0.5555555555555556, "#d8576b"],
                    [0.6666666666666666, "#ed7953"],
                    [0.7777777777777778, "#fb9f3a"],
                    [0.8888888888888888, "#fdca26"],
                    [1.0, "#f0f921"],
                  ],
                },
              ],
              choropleth: [
                {
                  type: "choropleth",
                  colorbar: { outlinewidth: 0, ticks: "" },
                },
              ],
              histogram2d: [
                {
                  type: "histogram2d",
                  colorbar: { outlinewidth: 0, ticks: "" },
                  colorscale: [
                    [0.0, "#0d0887"],
                    [0.1111111111111111, "#46039f"],
                    [0.2222222222222222, "#7201a8"],
                    [0.3333333333333333, "#9c179e"],
                    [0.4444444444444444, "#bd3786"],
                    [0.5555555555555556, "#d8576b"],
                    [0.6666666666666666, "#ed7953"],
                    [0.7777777777777778, "#fb9f3a"],
                    [0.8888888888888888, "#fdca26"],
                    [1.0, "#f0f921"],
                  ],
                },
              ],
              heatmap: [
                {
                  type: "heatmap",
                  colorbar: { outlinewidth: 0, ticks: "" },
                  colorscale: [
                    [0.0, "#0d0887"],
                    [0.1111111111111111, "#46039f"],
                    [0.2222222222222222, "#7201a8"],
                    [0.3333333333333333, "#9c179e"],
                    [0.4444444444444444, "#bd3786"],
                    [0.5555555555555556, "#d8576b"],
                    [0.6666666666666666, "#ed7953"],
                    [0.7777777777777778, "#fb9f3a"],
                    [0.8888888888888888, "#fdca26"],
                    [1.0, "#f0f921"],
                  ],
                },
              ],
              heatmapgl: [
                {
                  type: "heatmapgl",
                  colorbar: { outlinewidth: 0, ticks: "" },
                  colorscale: [
                    [0.0, "#0d0887"],
                    [0.1111111111111111, "#46039f"],
                    [0.2222222222222222, "#7201a8"],
                    [0.3333333333333333, "#9c179e"],
                    [0.4444444444444444, "#bd3786"],
                    [0.5555555555555556, "#d8576b"],
                    [0.6666666666666666, "#ed7953"],
                    [0.7777777777777778, "#fb9f3a"],
                    [0.8888888888888888, "#fdca26"],
                    [1.0, "#f0f921"],
                  ],
                },
              ],
              contourcarpet: [
                {
                  type: "contourcarpet",
                  colorbar: { outlinewidth: 0, ticks: "" },
                },
              ],
              contour: [
                {
                  type: "contour",
                  colorbar: { outlinewidth: 0, ticks: "" },
                  colorscale: [
                    [0.0, "#0d0887"],
                    [0.1111111111111111, "#46039f"],
                    [0.2222222222222222, "#7201a8"],
                    [0.3333333333333333, "#9c179e"],
                    [0.4444444444444444, "#bd3786"],
                    [0.5555555555555556, "#d8576b"],
                    [0.6666666666666666, "#ed7953"],
                    [0.7777777777777778, "#fb9f3a"],
                    [0.8888888888888888, "#fdca26"],
                    [1.0, "#f0f921"],
                  ],
                },
              ],
              surface: [
                {
                  type: "surface",
                  colorbar: { outlinewidth: 0, ticks: "" },
                  colorscale: [
                    [0.0, "#0d0887"],
                    [0.1111111111111111, "#46039f"],
                    [0.2222222222222222, "#7201a8"],
                    [0.3333333333333333, "#9c179e"],
                    [0.4444444444444444, "#bd3786"],
                    [0.5555555555555556, "#d8576b"],
                    [0.6666666666666666, "#ed7953"],
                    [0.7777777777777778, "#fb9f3a"],
                    [0.8888888888888888, "#fdca26"],
                    [1.0, "#f0f921"],
                  ],
                },
              ],
              mesh3d: [
                { type: "mesh3d", colorbar: { outlinewidth: 0, ticks: "" } },
              ],
              scatter: [
                {
                  fillpattern: { fillmode: "overlay", size: 10, solidity: 0.2 },
                  type: "scatter",
                },
              ],
              parcoords: [
                {
                  type: "parcoords",
                  line: { colorbar: { outlinewidth: 0, ticks: "" } },
                },
              ],
              scatterpolargl: [
                {
                  type: "scatterpolargl",
                  marker: { colorbar: { outlinewidth: 0, ticks: "" } },
                },
              ],
              bar: [
                {
                  error_x: { color: "#2a3f5f" },
                  error_y: { color: "#2a3f5f" },
                  marker: {
                    line: { color: "#E5ECF6", width: 0.5 },
                    pattern: { fillmode: "overlay", size: 10, solidity: 0.2 },
                  },
                  type: "bar",
                },
              ],
              scattergeo: [
                {
                  type: "scattergeo",
                  marker: { colorbar: { outlinewidth: 0, ticks: "" } },
                },
              ],
              scatterpolar: [
                {
                  type: "scatterpolar",
                  marker: { colorbar: { outlinewidth: 0, ticks: "" } },
                },
              ],
              histogram: [
                {
                  marker: {
                    pattern: { fillmode: "overlay", size: 10, solidity: 0.2 },
                  },
                  type: "histogram",
                },
              ],
              scattergl: [
                {
                  type: "scattergl",
                  marker: { colorbar: { outlinewidth: 0, ticks: "" } },
                },
              ],
              scatter3d: [
                {
                  type: "scatter3d",
                  line: { colorbar: { outlinewidth: 0, ticks: "" } },
                  marker: { colorbar: { outlinewidth: 0, ticks: "" } },
                },
              ],
              scattermapbox: [
                {
                  type: "scattermapbox",
                  marker: { colorbar: { outlinewidth: 0, ticks: "" } },
                },
              ],
              scatterternary: [
                {
                  type: "scatterternary",
                  marker: { colorbar: { outlinewidth: 0, ticks: "" } },
                },
              ],
              scattercarpet: [
                {
                  type: "scattercarpet",
                  marker: { colorbar: { outlinewidth: 0, ticks: "" } },
                },
              ],
              carpet: [
                {
                  aaxis: {
                    endlinecolor: "#2a3f5f",
                    gridcolor: "white",
                    linecolor: "white",
                    minorgridcolor: "white",
                    startlinecolor: "#2a3f5f",
                  },
                  baxis: {
                    endlinecolor: "#2a3f5f",
                    gridcolor: "white",
                    linecolor: "white",
                    minorgridcolor: "white",
                    startlinecolor: "#2a3f5f",
                  },
                  type: "carpet",
                },
              ],
              table: [
                {
                  cells: {
                    fill: { color: "#EBF0F8" },
                    line: { color: "white" },
                  },
                  header: {
                    fill: { color: "#C8D4E3" },
                    line: { color: "white" },
                  },
                  type: "table",
                },
              ],
              barpolar: [
                {
                  marker: {
                    line: { color: "#E5ECF6", width: 0.5 },
                    pattern: { fillmode: "overlay", size: 10, solidity: 0.2 },
                  },
                  type: "barpolar",
                },
              ],
              pie: [{ automargin: true, type: "pie" }],
            },
            layout: {
              autotypenumbers: "strict",
              colorway: [
                "#636efa",
                "#EF553B",
                "#00cc96",
                "#ab63fa",
                "#FFA15A",
                "#19d3f3",
                "#FF6692",
                "#B6E880",
                "#FF97FF",
                "#FECB52",
              ],
              font: { color: "#2a3f5f" },
              hovermode: "closest",
              hoverlabel: { align: "left" },
              paper_bgcolor: "white",
              plot_bgcolor: "#E5ECF6",
              polar: {
                bgcolor: "#E5ECF6",
                angularaxis: {
                  gridcolor: "white",
                  linecolor: "white",
                  ticks: "",
                },
                radialaxis: {
                  gridcolor: "white",
                  linecolor: "white",
                  ticks: "",
                },
              },
              ternary: {
                bgcolor: "#E5ECF6",
                aaxis: { gridcolor: "white", linecolor: "white", ticks: "" },
                baxis: { gridcolor: "white", linecolor: "white", ticks: "" },
                caxis: { gridcolor: "white", linecolor: "white", ticks: "" },
              },
              coloraxis: { colorbar: { outlinewidth: 0, ticks: "" } },
              colorscale: {
                sequential: [
                  [0.0, "#0d0887"],
                  [0.1111111111111111, "#46039f"],
                  [0.2222222222222222, "#7201a8"],
                  [0.3333333333333333, "#9c179e"],
                  [0.4444444444444444, "#bd3786"],
                  [0.5555555555555556, "#d8576b"],
                  [0.6666666666666666, "#ed7953"],
                  [0.7777777777777778, "#fb9f3a"],
                  [0.8888888888888888, "#fdca26"],
                  [1.0, "#f0f921"],
                ],
                sequentialminus: [
                  [0.0, "#0d0887"],
                  [0.1111111111111111, "#46039f"],
                  [0.2222222222222222, "#7201a8"],
                  [0.3333333333333333, "#9c179e"],
                  [0.4444444444444444, "#bd3786"],
                  [0.5555555555555556, "#d8576b"],
                  [0.6666666666666666, "#ed7953"],
                  [0.7777777777777778, "#fb9f3a"],
                  [0.8888888888888888, "#fdca26"],
                  [1.0, "#f0f921"],
                ],
                diverging: [
                  [0, "#8e0152"],
                  [0.1, "#c51b7d"],
                  [0.2, "#de77ae"],
                  [0.3, "#f1b6da"],
                  [0.4, "#fde0ef"],
                  [0.5, "#f7f7f7"],
                  [0.6, "#e6f5d0"],
                  [0.7, "#b8e186"],
                  [0.8, "#7fbc41"],
                  [0.9, "#4d9221"],
                  [1, "#276419"],
                ],
              },
              xaxis: {
                gridcolor: "white",
                linecolor: "white",
                ticks: "",
                title: { standoff: 15 },
                zerolinecolor: "white",
                automargin: true,
                zerolinewidth: 2,
              },
              yaxis: {
                gridcolor: "white",
                linecolor: "white",
                ticks: "",
                title: { standoff: 15 },
                zerolinecolor: "white",
                automargin: true,
                zerolinewidth: 2,
              },
              scene: {
                xaxis: {
                  backgroundcolor: "#E5ECF6",
                  gridcolor: "white",
                  linecolor: "white",
                  showbackground: true,
                  ticks: "",
                  zerolinecolor: "white",
                  gridwidth: 2,
                },
                yaxis: {
                  backgroundcolor: "#E5ECF6",
                  gridcolor: "white",
                  linecolor: "white",
                  showbackground: true,
                  ticks: "",
                  zerolinecolor: "white",
                  gridwidth: 2,
                },
                zaxis: {
                  backgroundcolor: "#E5ECF6",
                  gridcolor: "white",
                  linecolor: "white",
                  showbackground: true,
                  ticks: "",
                  zerolinecolor: "white",
                  gridwidth: 2,
                },
              },
              shapedefaults: { line: { color: "#2a3f5f" } },
              annotationdefaults: {
                arrowcolor: "#2a3f5f",
                arrowhead: 0,
                arrowwidth: 1,
              },
              geo: {
                bgcolor: "white",
                landcolor: "#E5ECF6",
                subunitcolor: "white",
                showland: true,
                showlakes: true,
                lakecolor: "white",
              },
              title: { x: 0.05 },
              mapbox: { style: "light" },
            },
          },
        },
        { responsive: true }
      );
    }
  },
  mounted() {
    window.onscroll = () => {
      let vh = window.innerHeight;
      let sh = document.documentElement.scrollHeight;
      let top = document.documentElement.scrollTop;
      let ss = document.querySelectorAll("section");
      let h1 = ss[0].offsetTop;
      let h2 = ss[1].offsetTop;
      let h3 = ss[2].offsetTop;

      ss.forEach((v) => {
        if (v.offsetTop < vh + top - v.offsetHeight / 2) {
          v.classList.remove("hide");
        }
      });
    };
  },
};
</script>

<style lang="less">
.main-draft {
  background-color: #fff;
  padding: 100px;
  overflow: hidden;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: left;

  h1 span {
    font-weight: 200;
  }

  .banner-container {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;

    .img-container {
      width: 40%;
      min-height: 200px;
      overflow: hidden;
      position: relative;

      .origin {
        position: absolute;
        animation: myfade 3s 2s infinite alternate;
      }

      .result {
        position: absolute;
      }

      @keyframes myfade {
        0% {
          opacity: 1;
        }

        100% {
          opacity: 0;
        }
      }

      img {
        width: 100%;
        display: block;
      }
    }

    .link-container {
      flex: 1;
      margin-left: 20px;

      .router-wrap {
        display: flex;
        margin: 20px 0;
        height: 200px;

        div {
          text-align: center;
          width: 45%;
          margin-right: 10px;
          border: 1px solid #409eff;
          border-radius: 5px;
          line-height: 200px;
          cursor: pointer;

          span {
            font-size: 32px;
          }
        }

        .router-search {
          border-style: dotted;
          color: #409eff;
        }

        .router-upload {
          background-color: #409eff;
          color: #fff;
        }
      }
    }
  }
}

.sub-title {
  margin: 100px auto 20px;
}

.hide {
  .tl {
    transform: translateX(-100%);
    opacity: 0;
  }

  .tr {
    transform: translateX(100%);
    opacity: 0;
  }
}

.section {
  display: flex;
  justify-content: space-around;
  margin: 50px 0;

  img {
    transition: 0.7s ease;
    width: 40%;
    display: block;
  }

  div {
    transition: 0.7s ease;
    width: 40%;
    padding: 50px 30px;

    h3 {
      color: #1a1a1a;
    }

    p {
      color: #666;
      margin-top: 30px;
      text-align: left;
      font-size: 16px;
      line-height: 2em;
    }
  }
}
</style>
