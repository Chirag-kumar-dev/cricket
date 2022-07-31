const getAllMatches=require("./config/db");
const getMatchById=require("./config/db");
const express= require("express");
const app= express()
const port = 6969;
const userData= require("./backend_sample_data.json")
const luxon  = require("luxon");
const DateTime=luxon.DateTime;
const {GraphQLID,GraphQLNonNull,GraphQLSchema,GraphQLObjectType,GraphQLInt,GraphQLString, GraphQLScalarType, GraphQLList} = require("graphql")
const graphql=require("graphql");
const {graphqlHTTP}=require("express-graphql");
const connectDB = require('./config/db');
const mongoose=require("mongoose");
const getMatchesByDateRange = require("./config/db");
// const getMatchById = require("./config/db");
// const data=mongoose.model("matches");
//database connect
connectDB();
// const { GraphQLSchema } = require("graphql");

const MatchType=new GraphQLObjectType({
    name:"Match",
    fields:()=>({
        equation: {type: GraphQLString},
        teamscores: {type: GraphQLString},
        daynight: {type: GraphQLString},
        gmt_offset: {type: GraphQLString},
        group: {type: GraphQLString},
        league: {type: GraphQLString},
        live: {type: GraphQLString},
        livecoverage: {type: GraphQLString},
        match_Id: {type: GraphQLString},
        matchfile: {type: GraphQLString},
        matchnumber: {type: GraphQLString},
        matchresult: {type: GraphQLString},
        matchstatus: {type: GraphQLString},
        matchdate_gmt: {type: GraphQLString},
        matchdate_ist: {type: GraphQLString},
        matchdate_local: {type: GraphQLString},
        matchtime_gmt: {type: GraphQLString},
        matchtime_ist: {type: GraphQLString},
        matchtime_local: {type: GraphQLString},
        end_matchdate_gmt: {type: GraphQLString},
        end_matchdate_ist: {type: GraphQLString},
        end_matchdate_local:{type: GraphQLString},
        end_matchtime_gmt: {type: GraphQLString},
        end_matchtime_ist: {type: GraphQLString},
        end_matchtime_local: {type: GraphQLString},
        matchtype: {type: GraphQLString},
        priority: {type: GraphQLString},
        recent: {type: GraphQLString},
        series_Id: {type: GraphQLString},
        seriesname: {type: GraphQLString},
        series_short_display_name: {type: GraphQLString},
        series_type: {type: GraphQLString},
        series_start_date: {type: GraphQLString},
        series_end_date: {type: GraphQLString},
        toss_elected_to: {type: GraphQLString},
        toss_won_by: {type: GraphQLString},
        parent_id: {type: GraphQLString},
        parent_name: {type: GraphQLString},
        has_standings: {type: GraphQLString},
        match_ordinal: {type: GraphQLString},
        coverage_level_id: {type: GraphQLString},
        coverage_level: {type: GraphQLString},
        has_scores: {type: GraphQLString},
        has_comm: {type: GraphQLString},
        teama_hassquads: {type: GraphQLString},
        teamb_hassquads: {type: GraphQLString},
        matchstatus_Id: {type: GraphQLString},
        comp_type: {type: GraphQLString},
        comp_type_id: {type: GraphQLString},
        championship_id: {type: GraphQLString},
        championship_name: {type: GraphQLString},
        stage: {type: GraphQLString},
        teama: {type: GraphQLString},
        teama_short: {type: GraphQLString},
        teama_Id: {type: GraphQLString},
        teamb: {type: GraphQLString},
        teamb_short: {type: GraphQLString},
        teamb_Id: {type: GraphQLString},
        tour_Id: {type: GraphQLString},
        tourname: {type: GraphQLString},
        upcoming: {type: GraphQLString},
        venue: {type: GraphQLString},
        venue_Id: {type: GraphQLString},
        winningmargin: {type: GraphQLString},
        winningteam_Id: {type: GraphQLString},
        SeriesStatus: {type: GraphQLString},
        Isso: {type: GraphQLString},
        audience_id: {type: GraphQLString},
        audience_type: {type: GraphQLString},
    })
})

const RootQuery= new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        getAllMatches:{
            type: new GraphQLList(MatchType),
            args:{ match_Id:{type:GraphQLString}},
            resolve(parent,args){
                return getAllMatches();
            }

        },
        getMatchById:{
            type:MatchType,
            args:{match_Id:{type:new GraphQLNonNull(GraphQLID)}},
            resolve:(root,args,context,info)=>{
                return getMatchById(args.match_Id);
            }
        },
        getMatchesByDateRange:{
            type:new GraphQLList(MatchType),
            args:{startDate:{type:new GraphQLNonNull(GraphQLString)},
                    endDate:{type:new GraphQLNonNull(GraphQLString)}
                },
            resolve:(root,args,context,info)=>{
                // const startDate = DateTime.fromFormat(args.startDate, "dd-MM-yyyy");
                // const endDate = DateTime.fromFormat(args.endDate, "dd-MM-yyyy");
                // const array=userData.data.matches.filter((m)=>{
                    // const matchDate=DateTime.fromFormat(m.matchdate_gmt, "M/d/yyyy");
                    // console.log(matchDate,startDate);
                    // return matchDate>startDate || matchDate<endDate ;
                    return getMatchesByDateRange(args.startDate,args.endDate);
                // })
                // console.log(array);
                // return array;
               
            }
        },
        getmatchesByPagination:{
            type:new GraphQLList(MatchType),
            args:{page:{defaultValue:0,type:new GraphQLNonNull(GraphQLInt)}
                },
            resolve:(root,args,context,info)=>{
                console.log("page----------",args.page)
                const start=args.page*10;
                const end=start+10;
                const array=userData.data.matches.slice(start,end)
                console.log(userData.data.matches.length)
                return array;
               
            }
        },
    }
})

const Mutation=new GraphQLObjectType({
    name:"Mutation",
    type:MatchType,
    fields:{
        updateMatchField:{
            type:MatchType,
            args:{
                match_Id:{type:new GraphQLNonNull(GraphQLString)},
                fieldName:{type:new GraphQLNonNull(GraphQLString)},
                value:{type:new GraphQLNonNull(GraphQLString)},

            },
            resolve(parent,args){
                const matchObject=userData.data.matches.find((m)=>m.match_Id===args.match_Id);
                console.log(matchObject);
                if(matchObject){
                    if(args.fieldName in matchObject){
                        matchObject[args.fieldName]=args.value;
                        return matchObject;
                    }else{
                        throw new Error("Field name is not valid");
                    }
                }else{
                    throw new Error("Match not found!");
                }
            }
        }
    }
})

const schema=new GraphQLSchema({query: RootQuery,mutation:Mutation})
app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:true
}))
app.listen(port,()=>{
    console.log("server running at , http://localhost:6969")
})