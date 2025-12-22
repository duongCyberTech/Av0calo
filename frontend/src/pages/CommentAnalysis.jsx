import { useState, useEffect } from "react";
import Header from "../components/Header";
import BarsDataset from "../component/BarChartComponent";
import MultipleSelectCheckmarks from "../component/SelectBox";
import { fetchAnalysis } from "../services/sentimentAnalysis";
import { Box } from "@mui/material";

export default function CommentAnalysis(){

  const fullAspects = ["Đóng gói", "Sản phẩm", "Bơ", "Dầu", "Snack"]
  const label = "Hạng mục cần phân tích"
  const [dataComments, setComments] = useState([])
  const [aspects, setAspects] = useState([])
  const [analysisData, setAnalysisData] = useState([]) 

  useEffect(() => {
    const fetchCommentAnalysis = async() => {
      try {
        const payload = {
          comments: dataComments,
          aspects
        }
        const res = await fetchAnalysis(payload)
        console.log("Ana Fetch: ", res)

        const resAspects = [...new Set(res.data.analysis.map(item => item.aspect))]
        const resSentiments = [...new Set(res.data.analysis.map(item => item.sentiment))]
        setAnalysisData(resAspects.map(asp => {
          const row = { aspect: asp }
          resSentiments.forEach(sent => {
            row[sent] = res.data.analysis.filter(d => d.aspect === asp && d.sentiment === sent).length
          })
          return row
        }))
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchCommentAnalysis()
  }, [aspects])

  return (
    <div className="bg-[#F9FBF7] min-h-screen">
      <Header />
      <Box sx={{
        display: "inline-flex",
        gap: "10px",
        mt: "20px",
        ml: "50px"
      }}>
        <MultipleSelectCheckmarks names={fullAspects} options={aspects} setOptions={setAspects} label={label} />
      </Box>
      <div className="pt-10 text-center">
        <h1 className="text-3xl font-bold text-[#2E4A26]">Phân tích phản hồi người dùng</h1>
        <BarsDataset data={analysisData}/>
      </div>
    </div>
  );
}