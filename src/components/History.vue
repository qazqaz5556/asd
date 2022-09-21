<template>
    <div class="history">
        <ul class="history-list-container">
            <li v-for="item in history" class="history-list-item">
                <span disabled=""
                      class="action-type"
                      :class="{
                          now:item.state==='now',
                          edit:['放大','缩小','翻转','移动'].indexOf(item.type)!==-1,
                          add:item.type==='新增',
                          del:item.type==='删除',
                          seg:item.type==='抠图'
                      }">
                    {{item.type}}
                </span>
                <span>状态：{{item.state}}</span>
            </li>
        </ul>
        <ul>
            <li></li>
        </ul>
    </div>
</template>

<script>
    import {GOTO_HISTORY} from "../store/mutation-types";
    import {mapState, mapMutations} from 'vuex'

    export default {
        name: "History",
        computed: {
            ...mapState(['history'])
        },
        methods: {
            ...mapMutations([GOTO_HISTORY])
        }
    }
</script>

<style scoped lang="less">
    .history {
        display: flex;

        .history-list-container {
            background-color: #fff;
            border-radius: 5px;
            border: 1px solid #ccc;
            box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, .5);
            padding: 0 10px;
            margin: 0;

            .history-list-item {
                margin: 10px 0;
                border-radius: 5px;
                border: 1px solid #ccc;
                display: flex;
                align-items: center;
                span{
                    font-size:14px ;
                }
            }

            .action-type {
                font-size: 12px;
                padding: 3px 5px;
                border-radius: 4px;
                margin: 0 4px;
                height: 18px;
                line-height: 12px;
            }

            .now {
                color: #a71d5d;
            }

            .add {
                background-color: #67c23a
            }

            .del {
                background-color: #f56c6c
            }

            .seg {
                background-color: #409eff;
            }

            .edit {
                background-color: #909399;
            }

        }
    }
</style>
