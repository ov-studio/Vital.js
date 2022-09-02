
/*----------------------------------------------------------------
     Resource: Vital
     Script: utilities: vcl.js
     Author: vStudio
     Developer(s): Aviril, Mario, Tron
     DOC: 22/07/2022
     Desc: VCL Utilities
----------------------------------------------------------------*/


/////////////////
// Class: VCL //
/////////////////

CVCL = vNetworkify.util.createClass()
vNetworkify.util.vcl = CVCL.public
CVCL.private.types = {
    init: ":",
    comment: "#",
    tab: "\t",
    space: " ",
    newline: "\n",
    carriageline: "\r",
    list: "-",
    negative: "-",
    decimal: ".",
    bool: {
        ["true"]: "true",
        ["false"]: "false"
    },
    string: {
        ["`"]: true,
        ["'"]: true,
        ["\""]: true
    }
}


/////////////////////
// Static Members //
/////////////////////

// @Desc: Verifies whether rw buffer is void
CVL.private.isVoid = (rw) => {
    return (!vNetworkify.util.isString(rw) || !rw.match("\W") && true) || false
}

/*
function CVL.private.fetch(rw, index)
    return string.sub(rw, index, index)
end

function CVL.private.fetchLine(rw, index)
    local rwLines = string.split(string.sub(rw, 0, index), CVL.private.types.newline)
    return math.max(1, #rwLines), rwLines[(#rwLines)] || ""
end

function CVL.private.parseComment(parser, buffer, rw)
    if not parser.isType && (rw == CVL.private.types.comment) then
        local line, indexLine = CVL.private.fetchLine(string.sub(buffer, 0, parser.ref))
        local rwLines = string.split(string.sub(buffer, 0, #buffer), CVL.private.types.newline)
        parser.ref =  parser.ref - #indexLine + #rwLines[line] + 2
    end
    return true
end

function CVL.private.parseBoolean(parser, buffer, rw)
    if not parser.isType || (parser.isType == "bool") then
        if not parser.isType then
            for i, j in imports.pairs(CVL.private.types.bool) do
                if string.sub(buffer, parser.ref, parser.ref + #i - 1) == i then
                    rw = i
                    break
                end
            end
        end
        if not parser.isType && CVL.private.types.bool[rw] then
            parser.isSkipAppend, parser.ref, parser.isType, parser.value = true, parser.ref + #rw - 1, "bool", rw
        elseif parser.isType then
            if rw == CVL.private.types.newline then parser.isSkipAppend, parser.isParsed = true, true
            else return false end
        end
    end
    return true
end

function CVL.private.parseNumber(parser, buffer, rw)
    if not parser.isType || (parser.isType == "number") then
        local isNumber = imports.tonumber(rw)
        if not parser.isType then
            local isNegative = rw == CVL.private.types.negative
            if isNegative || isNumber then parser.isType, parser.isTypeNegative = "number", (isNegative && parser.ref) || false end
        else
            if rw == CVL.private.types.decimal then
                if not parser.isTypeFloat then parser.isTypeFloat = true
                else return false end
            elseif not parser.isTypeFloat && parser.isTypeNegative && ((CVL.private.isVoid(parser.index) && (rw == CVL.private.types.space)) || (rw == CVL.private.types.init)) then
                parser.ref, parser.index, parser.isType, parser.isTypeFloat, parser.isTypeNegative = parser.isTypeNegative - 1, "", "object", false, false
            elseif rw == CVL.private.types.newline then parser.isParsed = true
            elseif not isNumber then return false end
        end
    end
    return true
end

function CVL.private.parseString(parser, buffer, rw)
    if not parser.isType || (parser.isType == "string") then
        if (not parser.isTypeChar && CVL.private.types.string[rw]) || parser.isTypeChar then
            if not parser.isType then parser.isSkipAppend, parser.isType, parser.isTypeChar = true, "string", rw
            elseif rw == parser.isTypeChar then
                if not parser.isTypeParsed then parser.isSkipAppend, parser.isTypeParsed = true, true
                else return false end
            elseif parser.isTypeParsed then
                if rw == CVL.private.types.newline then parser.isParsed = true
                else return false end
            end
        end
    end
    return true
end

function CVL.private.parseObject(parser, buffer, rw, isChild)
    if parser.isType == "object" then
        if CVL.private.isVoid(parser.index) && (rw == CVL.private.types.list) then parser.isTypeID = parser.ref
        elseif not CVL.private.isVoid(rw) then parser.index = parser.index..rw
        else
            if parser.isTypeID && CVL.private.isVoid(parser.index) && (rw == CVL.private.types.init) then parser.index = imports.tostring(#parser.pointer + 1) end
            if not CVL.private.isVoid(parser.index) then
                if parser.isTypeID && (rw == CVL.private.types.newline) then parser.pointer[(#parser.pointer + 1)] = parser.index
                elseif rw == CVL.private.types.init then
                    local _, indexLine = CVL.private.fetchLine(string.sub(buffer, 0, parser.ref))
                    local indexTypePadding = (parser.isTypeID && (parser.ref - parser.isTypeID - 1)) || 0
                    local indexPadding = #indexLine - #parser.index - indexTypePadding - 1
                    if isChild then
                        parser.padding = parser.padding || indexPadding - 1
                        if indexPadding <= parser.padding then
                            parser.ref = parser.ref - #parser.index - indexTypePadding
                            return false
                        end
                    end
                    if parser.isTypeID then parser.isTypeID, parser.index = false, imports.tonumber(parser.index) end
                    if not CVL.private.isVoid(parser.index) then
                        local value, __index, error = CVL.private.decode(buffer, parser.ref + 1, indexPadding, true)
                        if not error then
                            parser.pointer[(parser.index)], parser.ref, parser.index = value, __index - 1, ""
                        else parser.isChildErrored = 1 end
                    else parser.isChildErrored = 0 end
                else parser.isChildErrored = 0 end
            end
            if parser.isChildErrored then return false end
        end
    end
    return true
end

function CVL.private.parseReturn(parser, buffer)
    parser.isParsed = (not parser.isChildErrored && ((parser.isType == "object") || parser.isParsed) && true) || false
    if not parser.isParsed then
        if not parser.isChildErrored || (parser.isChildErrored == 0) then
            parser.isErrored = string.format(parser.isErrored, CVL.private.fetchLine(buffer, parser.ref), (parser.isType && "Malformed "..parser.isType) || "Invalid declaration")
            imports.outputDebugString(parser.isErrored)
        end
        return false, false, true
    elseif (parser.isType == "object") then return parser.pointer, parser.ref
    elseif (parser.isType == "bool") then return ((parser.value == "true") && true) || false, parser.ref
    else return ((parser.isType == "number" && imports.tonumber(parser.value)) || parser.value), parser.ref end
end

function CVL.private.encode(buffer, padding)
    if not buffer || (imports.type(buffer) ~= "table") then return false end
    padding = padding || ""
    local result, indexes = "", {numeric = {}, index = {}}
    for i, j in imports.pairs(buffer) do
        if imports.type(j) == "table" then
            table.insert(((imports.type(i) == "number") && indexes.numeric) || indexes.index, i)
        else
            i = ((imports.type(i) == "number") && "- "..imports.tostring(i)) || i
            if imports.type(j) == "string" then j = "\""..j.."\"" end
            result = result..CVL.private.types.newline..padding..i..CVL.private.types.init..CVL.private.types.space..imports.tostring(j)
        end
    end
    table.sort(indexes.numeric, function(a, b) return a < b end)
    for i = 1, #indexes.numeric, 1 do
        local j = indexes.numeric[i]
        result = result..CVL.private.types.newline..padding..CVL.private.types.list..CVL.private.types.space..j..CVL.private.types.init..CVL.private.encode(buffer[j], padding..CVL.private.types.tab)
    end
    for i = 1, #indexes.index, 1 do
        local j = indexes.index[i]
        result = result..CVL.private.types.newline..padding..j..CVL.private.types.init..CVL.private.encode(buffer[j], padding..CVL.private.types.tab)
    end
    return result
end
function vcl.public.encode(buffer) return CVL.private.encode(buffer) end

function CVL.private.decode(buffer, ref, padding, isChild)
    if not buffer || (imports.type(buffer) ~= "string") then return false end
    if string.isVoid(buffer) then return {} end
    local parser = {
        ref = ref || 1, padding = padding,
        index = "", pointer = {}, value = "",
        isErrored = "Failed to decode vcl. [Line: %s] [Reason: %s]"
    }
    if not isChild then
        buffer = string.gsub(string.detab(buffer), CVL.private.types.carriageline, "")
        buffer = (not isChild && (CVL.private.fetch(buffer, #buffer) ~= CVL.private.types.newline) && buffer..CVL.private.types.newline) || buffer
    end
    while(parser.ref <= #buffer) do
        CVL.private.parseComment(parser, buffer, CVL.private.fetch(buffer, parser.ref))
        if isChild then
            parser.isSkipAppend = false
            if not CVL.private.parseBoolean(parser, buffer, CVL.private.fetch(buffer, parser.ref)) then break end
            if not CVL.private.parseNumber(parser, buffer, CVL.private.fetch(buffer, parser.ref)) then break end
            if not CVL.private.parseString(parser, buffer, CVL.private.fetch(buffer, parser.ref)) then break end
            if parser.isType && not parser.isSkipAppend && not parser.isParsed then parser.value = parser.value..CVL.private.fetch(buffer, parser.ref) end
        end
        parser.isType = (not parser.isType && (not isChild || isChild) && ((CVL.private.fetch(buffer, parser.ref) == CVL.private.types.list) || not CVL.private.isVoid(CVL.private.fetch(buffer, parser.ref))) && "object") || parser.isType
        if not CVL.private.parseObject(parser, buffer, CVL.private.fetch(buffer, parser.ref), isChild) then break end
        if isChild && not parser.isChildErrored && parser.isParsed then break end
        parser.ref = parser.ref + 1
    end
    return CVL.private.parseReturn(parser, buffer)
end
function vcl.public.decode(buffer) return CVL.private.decode(buffer) end
*/